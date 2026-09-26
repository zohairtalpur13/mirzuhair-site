"""SCRAP — still lifes rendered headless in Blender (Cycles).

Usage:
  Blender -b -P scrap_covers.py -- <scene> <out.jpg> [mask]

Scenes 1-6 are the issue covers: one thrown-away paper thing cast as a luxury
object. `mask` renders only the hero object's alpha so the cover layout can
put the object in front of the masthead.
"""
import math
import os
import sys

import bpy
import bmesh
import numpy as np
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1:]
SCENE_ID = ARGS[0]
OUT = os.path.abspath(ARGS[1])
MASK = len(ARGS) > 2 and ARGS[2] == "mask"

RES_X, RES_Y = 1000, 1250
SAMPLES = 16 if MASK else 192
GOLD = (1.0, 0.72, 0.3)
PORCELAIN = (0.93, 0.92, 0.89)
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


# ── Scene setup ──────────────────────────────────────────────

def reset_scene(res=(RES_X, RES_Y)):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.resolution_percentage = 50 if MASK else 100
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = not MASK
    scene.render.film_transparent = MASK
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = -1.3
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = True
        scene.cycles.device = "GPU"
    except Exception as err:  # CPU still renders, only slower
        print("SCRAP: GPU unavailable, using CPU:", err)
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.04, 0.04, 0.045, 1)
    bg.inputs["Strength"].default_value = 0.35
    scene.world = world
    return scene


def principled(name, color, rough=0.3, metal=0.0, coat=0.0, transmission=0.0, sss=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Transmission Weight"].default_value = transmission
    b.inputs["Subsurface Weight"].default_value = sss
    b.inputs["Subsurface Radius"].default_value = (0.05, 0.04, 0.03)
    return mat


def gilded_mix(name, glaze_color, glaze_rough):
    """Glaze + gold shaders mixed by a colour ramp; returns (material, ramp node)."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    out = nt.nodes["Material Output"]
    glaze = nt.nodes["Principled BSDF"]
    glaze.inputs["Base Color"].default_value = (*glaze_color, 1)
    glaze.inputs["Roughness"].default_value = glaze_rough
    glaze.inputs["Coat Weight"].default_value = 0.8
    glaze.inputs["Subsurface Weight"].default_value = 0.08
    gold = nt.nodes.new("ShaderNodeBsdfPrincipled")
    gold.inputs["Base Color"].default_value = (*GOLD, 1)
    gold.inputs["Metallic"].default_value = 1.0
    gold.inputs["Roughness"].default_value = 0.2
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(ramp.outputs["Color"], mix.inputs["Fac"])
    nt.links.new(glaze.outputs["BSDF"], mix.inputs[1])
    nt.links.new(gold.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return mat, ramp


def ridge_gilded(name, glaze_color, glaze_rough=0.1, gold_amount=0.526):
    """Glazed porcelain whose sharpest ridges are gilded."""
    mat, ramp = gilded_mix(name, glaze_color, glaze_rough)
    geo = mat.node_tree.nodes.new("ShaderNodeNewGeometry")
    ramp.color_ramp.elements[0].position = gold_amount
    ramp.color_ramp.elements[1].position = gold_amount + 0.012
    mat.node_tree.links.new(geo.outputs["Pointiness"], ramp.inputs["Fac"])
    return mat


def kintsugi(name, glaze_color, scale=2.6):
    """Porcelain with gold crack lines from a Voronoi edge pattern."""
    mat, ramp = gilded_mix(name, glaze_color, 0.1)
    nt = mat.node_tree
    coord = nt.nodes.new("ShaderNodeTexCoord")
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Scale"].default_value = scale
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
    ramp.color_ramp.elements[1].position = 0.03
    ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
    nt.links.new(coord.outputs["Object"], vor.inputs["Vector"])
    nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
    return mat


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)


def parent_to(child, parent):
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()


# ── Geometry ─────────────────────────────────────────────────

def crumpled_ball(name, seed, radius=0.5, depth=0.3, subdiv=7):
    """A closed crumpled-paper ball: an icosphere pushed by random straight creases."""
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=1.0)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    n = len(mesh.vertices)
    co = np.empty(n * 3, dtype=np.float64)
    mesh.vertices.foreach_get("co", co)
    p = co.reshape(n, 3)
    p /= np.linalg.norm(p, axis=1, keepdims=True)
    rng = np.random.default_rng(seed)
    k = 70
    normals = rng.normal(size=(k, 3))
    normals /= np.linalg.norm(normals, axis=1, keepdims=True)
    offset = (rng.random(k) - 0.5) * 1.5
    amp = rng.random(k) - 0.5
    lim = 0.03 + rng.random(k) * 0.22
    disp = np.zeros(n)
    for i in range(k):
        disp += amp[i] * np.minimum(np.abs(p @ normals[i] - offset[i]), lim[i])
    disp -= disp.mean()
    disp /= np.abs(disp).max()
    p = p * (radius * (1 + depth * disp))[:, None] * np.array([1.0, 0.93, 0.9])
    mesh.vertices.foreach_set("co", p.ravel())
    mesh.update()
    obj = link(bpy.data.objects.new(name, mesh))
    for poly in mesh.polygons:
        poly.use_smooth = True
    mesh.set_sharp_from_angle(angle=math.radians(22))
    return obj


def lathe(name, profile, steps=128, thickness=0.025):
    """Spin an (r, z) profile around Z — plates and bowls."""
    bm = bmesh.new()
    verts = [bm.verts.new((r, 0, z)) for r, z in profile]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    bmesh.ops.spin(bm, geom=verts + edges, cent=(0, 0, 0), axis=(0, 0, 1),
                   angle=math.tau, steps=steps, use_duplicate=False)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = link(bpy.data.objects.new(name, mesh))
    for poly in mesh.polygons:
        poly.use_smooth = True
    obj.modifiers.new("thick", "SOLIDIFY").thickness = thickness
    obj.modifiers.new("sub", "SUBSURF").levels = 1
    return obj


def cyclorama(color, rough=0.85):
    """Seamless studio backdrop: floor curving up into a wall."""
    prof = [(y, 0.0) for y in np.linspace(-9, 0, 10)]
    prof += [(2.2 * math.sin(a), 2.2 - 2.2 * math.cos(a)) for a in np.linspace(0.1, math.pi / 2, 14)]
    prof += [(2.2, z) for z in np.linspace(2.4, 12, 8)]
    bm = bmesh.new()
    rows = [[bm.verts.new((x, y, z)) for y, z in prof] for x in (-14, 14)]
    for i in range(len(prof) - 1):
        bm.faces.new((rows[0][i], rows[1][i], rows[1][i + 1], rows[0][i + 1]))
    mesh = bpy.data.meshes.new("cyc")
    bm.to_mesh(mesh)
    bm.free()
    obj = link(bpy.data.objects.new("cyc", mesh))
    obj.location = (0, 1.2, 0)
    for poly in mesh.polygons:
        poly.use_smooth = True
    obj.modifiers.new("sub", "SUBSURF").levels = 2
    assign(obj, principled("backdrop", color, rough=rough))
    if MASK:
        obj.hide_render = True
    return obj


def area_light(name, loc, size, energy, color=(1, 1, 1), target=(0, 0, 0.5)):
    data = bpy.data.lights.new(name, "AREA")
    data.size = size
    data.energy = energy
    data.color = color
    obj = link(bpy.data.objects.new(name, data))
    obj.location = loc
    obj.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return obj


def camera(loc, target, lens=85, focus=None, fstop=4.0):
    data = bpy.data.cameras.new("cam")
    data.lens = lens
    data.sensor_fit = "VERTICAL"
    data.sensor_height = 30
    obj = link(bpy.data.objects.new("cam", data))
    obj.location = loc
    obj.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    if focus is not None:
        data.dof.use_dof = True
        data.dof.focus_distance = (Vector(focus) - Vector(loc)).length
        data.dof.aperture_fstop = fstop
    bpy.context.scene.camera = obj
    return obj


def studio(key=900, rim=500, warm=(1.0, 0.95, 0.88)):
    area_light("key", (-3.2, -3.0, 4.2), 3.0, key, warm)
    area_light("rim", (3.4, 2.0, 3.0), 1.6, rim, (0.9, 0.95, 1.0))
    area_light("fill", (3.5, -4.0, 1.2), 4.0, key * 0.18)


def label_text(body, size, loc, rot, color=(0.02, 0.02, 0.02)):
    curve = bpy.data.curves.new("label", "FONT")
    curve.body = body
    curve.size = size
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                curve.font = bpy.data.fonts.load(path)
                break
            except RuntimeError:
                continue
    curve.extrude = 0.0008
    obj = link(bpy.data.objects.new("label", curve))
    obj.location = loc
    obj.rotation_euler = rot
    assign(obj, principled("ink", color, rough=0.6))
    return obj


def paper_bag(name, mat):
    """An open shopping bag with two handles, thin walls, softly dented."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.normal.z > 0.9], context="FACES")
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    bag = link(bpy.data.objects.new(name, mesh))
    bag.scale = (0.95, 0.42, 1.2)
    bag.location = (0, 0, 0.6)
    bag.modifiers.new("thick", "SOLIDIFY").thickness = 0.02
    bag.modifiers.new("bevel", "BEVEL").width = 0.012
    sub = bag.modifiers.new("sub", "SUBSURF")
    sub.levels = 3
    sub.subdivision_type = "SIMPLE"
    tex = bpy.data.textures.new("dents", "VORONOI")
    tex.noise_scale = 0.35
    dents = bag.modifiers.new("dents", "DISPLACE")
    dents.texture = tex
    dents.strength = 0.018
    assign(bag, mat)
    handles = []
    for side in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.19, minor_radius=0.014,
                                         location=(0, side * 0.15, 1.12), rotation=(math.pi / 2, 0, 0))
        h = bpy.context.active_object
        assign(h, mat)
        handles.append(h)
    return bag, handles


# ── Issue covers ─────────────────────────────────────────────

def issue_1():
    """NOTHING NEW — the readymade: a crumpled page cast in porcelain, ridges gilded."""
    cyclorama((0.3, 0.27, 0.23))
    ball = crumpled_ball("ball", seed=7, radius=0.62)
    ball.location = (0, 0, 0.56)
    ball.rotation_euler = (0.3, 0.2, 0.8)
    assign(ball, ridge_gilded("porcelain", PORCELAIN))
    studio(key=1100, rim=700)
    camera((0, -7.2, 1.9), (0, 0, 0.98), lens=90, focus=(0, 0, 0.56), fstop=5.6)


def issue_2():
    """3% — a porcelain shopping bag, 97% ordinary: one red zip tie, "BAG" in quotes."""
    cyclorama((0.78, 0.55, 0.06))
    porcelain = principled("porcelain", PORCELAIN, rough=0.12, coat=0.7, sss=0.06)
    bag, handles = paper_bag("bag", porcelain)
    red = principled("zip", (0.85, 0.07, 0.03), rough=0.35)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.009,
                                     location=(0.0, -0.15, 1.31), rotation=(0, math.pi / 2, 0))
    tie = bpy.context.active_object
    tie.scale = (1, 1, 0.45)
    assign(tie, red)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.08, -0.16, 1.25))
    tail = bpy.context.active_object
    tail.scale = (0.18, 0.012, 0.004)
    tail.rotation_euler = (0, 0.9, 0)
    assign(tail, red)
    label = label_text("“BAG”", 0.26, (0, -0.222, 0.62), (math.pi / 2, 0, 0))
    root = bpy.data.objects.new("root", None)
    link(root)
    for obj in [bag, tie, tail, label] + handles:
        parent_to(obj, root)
    root.rotation_euler = (0, 0, -0.32)
    studio(key=1000, rim=600)
    camera((0.3, -6.6, 2.1), (0, 0, 1.12), lens=85, focus=(0, 0, 0.8), fstop=6.3)


def issue_3():
    """WORK IN PROGRESS — a plate broken and mended in gold, beside a crumpled draft."""
    cyclorama((0.02, 0.05, 0.33))
    profile = [(0.0, 0.0), (0.55, 0.0), (0.62, 0.02), (0.82, 0.07), (1.0, 0.1), (1.02, 0.11)]
    plate = lathe("plate", profile)
    plate.scale = (0.58, 0.58, 0.58)
    plate.location = (0.18, 0.25, 0.555)
    plate.rotation_euler = (1.22, 0.0, 0.22)
    assign(plate, kintsugi("kintsugi", PORCELAIN))
    ball = crumpled_ball("draft", seed=21, radius=0.24)
    ball.location = (-0.5, -0.35, 0.22)
    assign(ball, principled("paper", (0.9, 0.89, 0.86), rough=0.75, sss=0.1))
    studio(key=1200, rim=900, warm=(1.0, 0.93, 0.84))
    camera((0, -7.4, 1.9), (0, 0, 0.98), lens=85, focus=(0, 0.1, 0.55), fstop=5.6)


def issue_4():
    """TOURIST / PURIST — the same crumpled page twice: raw bisque, and black glaze with gold."""
    cyclorama((0.46, 0.13, 0.06))
    tourist = crumpled_ball("tourist", seed=11, radius=0.4)
    tourist.location = (-0.5, 0.1, 0.36)
    assign(tourist, principled("bisque", (0.82, 0.76, 0.68), rough=0.85))
    purist = crumpled_ball("purist", seed=11, radius=0.4)
    purist.location = (0.52, -0.1, 0.36)
    purist.rotation_euler = (0, 0, math.pi)
    assign(purist, ridge_gilded("black", (0.012, 0.012, 0.012), glaze_rough=0.06, gold_amount=0.528))
    studio(key=1000, rim=900)
    camera((0, -8.4, 1.8), (0, 0, 1.0), lens=85, focus=(0, 0, 0.36), fstop=8)


def issue_5():
    """SEE THROUGH — a crumpled page in clear glass, a gilded page held inside."""
    cyclorama((0.012, 0.012, 0.014))
    glass = crumpled_ball("glass", seed=5, radius=0.64, depth=0.16)
    glass.location = (0, 0, 0.6)
    glass.modifiers.new("thick", "SOLIDIFY").thickness = -0.03
    assign(glass, principled("glass", (1, 1, 1), rough=0.02, transmission=1.0))
    core = crumpled_ball("core", seed=9, radius=0.2)
    core.location = (0.02, 0, 0.58)
    assign(core, principled("gold", GOLD, rough=0.18, metal=1.0))
    area_light("top", (0, 0.6, 4.5), 2.0, 700)
    area_light("rimL", (-3, 2.5, 1.5), 1.0, 900, (0.85, 0.9, 1.0))
    area_light("rimR", (3, 2.5, 1.5), 1.0, 900, (1.0, 0.9, 0.8))
    area_light("front", (0, -5, 1.5), 5.0, 120)
    bpy.context.scene.cycles.max_bounces = 16
    bpy.context.scene.cycles.transmission_bounces = 16
    camera((0, -7.2, 1.7), (0, 0, 1.2), lens=90, focus=(0, 0, 0.6), fstop=5.6)


def issue_6():
    """GILDED — a crumpled page cast in gilded brass and worn as an earring."""
    cyclorama((0.55, 0.0, 0.13))
    ball = crumpled_ball("earring", seed=13, radius=0.42)
    ball.location = (0, 0, 0.95)
    gold = principled("gold", (1.0, 0.74, 0.32), rough=0.16, metal=1.0)
    assign(ball, gold)
    curve = bpy.data.curves.new("hook", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.018
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(2)
    for bp, co in zip(spline.bezier_points, [(0, 0, 1.22), (0.05, 0, 1.9), (-0.28, 0, 1.74)]):
        bp.co = co
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    hook = link(bpy.data.objects.new("hook", curve))
    hook.data.materials.append(gold)
    studio(key=1300, rim=1100, warm=(1.0, 0.96, 0.9))
    camera((0, -7.4, 1.8), (0, 0, 1.5), lens=85, focus=(0, 0, 0.95), fstop=5.6)


SCENES = {"1": issue_1, "2": issue_2, "3": issue_3, "4": issue_4, "5": issue_5, "6": issue_6}


def main():
    scene = reset_scene()
    SCENES[SCENE_ID]()
    fmt = scene.render.image_settings
    if MASK:
        fmt.file_format = "PNG"
        fmt.color_mode = "RGBA"
    else:
        fmt.file_format = "JPEG"
        fmt.quality = 92
    scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print("SCRAP: wrote", OUT)


main()
