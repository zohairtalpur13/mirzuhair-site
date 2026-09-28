"""“RAW” — The Houses Issue: five campaign still lifes in black and red (Blender, Cycles).

Usage:
  Blender -b -P houses.py -- <nuit|brut|velluto|zero|quote> <out.jpg>

Each scene is a campaign for an invented house, art-directed in the spirit of a real one.
Reuses the Cycles helpers from scrap/render/scrap_covers.py.
"""
import math
import os

import bmesh
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
with open(os.path.join(SITE, "scrap", "render", "scrap_covers.py"), encoding="utf-8") as fh:
    exec(compile(fh.read().rsplit("\nmain()", 1)[0], "scrap_covers.py", "exec"))  # helpers only

RED = (0.42, 0.006, 0.008)
BLACK = (0.008, 0.008, 0.009)


def lacquer(color, rough=0.08):
    return principled("lacquer", color, rough=rough, coat=1.0)


def velvet(color):
    mat = principled("velvet", color, rough=1.0)
    b = mat.node_tree.nodes["Principled BSDF"]
    b.inputs["Sheen Weight"].default_value = 1.0
    b.inputs["Sheen Roughness"].default_value = 0.35
    b.inputs["Sheen Tint"].default_value = (1.0, 0.35, 0.3, 1)
    return mat


def mirror_floor():
    bpy.ops.mesh.primitive_plane_add(size=40)
    assign(bpy.context.active_object, principled("mirror", (0.004, 0.004, 0.005), rough=0.06, coat=1.0))


def cylinder(name, r, h, loc, mat, verts=96, bevel=0.01):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, vertices=verts)
    obj = bpy.context.active_object
    obj.name = name
    obj.modifiers.new("bevel", "BEVEL").width = bevel
    for p in obj.data.polygons:
        p.use_smooth = True
    assign(obj, mat)
    return obj


def rounded_box(name, loc, size, mat, bevel=0.05, segments=6):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bev = obj.modifiers.new("bevel", "BEVEL")
    bev.width = bevel
    bev.segments = segments
    for p in obj.data.polygons:
        p.use_smooth = True
    assign(obj, mat)
    return obj


def slant_top(obj, angle):
    """Cut a lipstick bullet's top at an angle."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    top = max(v.co.z for v in bm.verts)
    no = Vector((math.sin(angle), 0, math.cos(angle)))
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, top * 0.35),
                           plane_no=no, clear_outer=True)
    bmesh.ops.holes_fill(bm, edges=bm.edges[:], sides=0)
    bm.to_mesh(obj.data)
    bm.free()


def bamboo(obj, nodes=14, swell=0.012):
    """Swell the handle every so often, like the joints of bamboo."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.y < -0.02], context="VERTS")
    for v in bm.verts:
        ang = math.atan2(v.co.y, v.co.x)
        s = swell * max(0.0, math.cos(ang * nodes)) ** 8
        v.co.x += s * math.cos(ang)
        v.co.y += s * math.sin(ang)
    bm.to_mesh(obj.data)
    bm.free()


def flash(energy=1600):
    """On-camera flash: hard, frontal, a little high."""
    data = bpy.data.lights.new("flash", "POINT")
    data.energy = energy
    data.shadow_soft_size = 0.08
    obj = link(bpy.data.objects.new("flash", data))
    obj.location = (0.3, -5.5, 2.6)


# ── Houses ───────────────────────────────────────────────────

def nuit():
    """NUIT — night, flash and lacquer: a red lipstick and a perfume bottle on black mirror."""
    mirror_floor()
    black = lacquer(BLACK, 0.05)
    red = lacquer(RED, 0.18)
    cylinder("case", 0.2, 0.62, (-0.35, 0, 0.31), black)
    bullet = cylinder("bullet", 0.15, 0.62, (0, 0, 0), red, bevel=0.005)
    slant_top(bullet, 0.75)
    bullet.location = (-0.35, 0, 0.62)
    cylinder("cap", 0.2, 0.55, (0.15, -0.55, 0.2), black).rotation_euler = (0, math.pi / 2, 0.6)
    glass = principled("glass", (1, 1, 1), rough=0.02, transmission=1.0)
    rounded_box("bottle", (0.75, 0.25, 0.55), (0.75, 0.42, 1.1), glass, bevel=0.08)
    juice = principled("juice", (0.7, 0.01, 0.02), rough=0.05, transmission=1.0)
    rounded_box("juice", (0.75, 0.25, 0.46), (0.6, 0.3, 0.8), juice, bevel=0.05)
    cylinder("stopper", 0.16, 0.34, (0.75, 0.25, 1.27), black)
    flash(1800)
    area_light("rim", (2.8, 2.5, 2.2), 1.2, 600, (1.0, 0.25, 0.2), target=(0.2, 0, 0.6))
    bpy.context.scene.cycles.transmission_bounces = 12
    camera((0.2, -4.6, 1.5), (0.2, 0, 0.65), lens=70, focus=(0, 0, 0.6), fstop=3.2)


def brut():
    """BRUT — deadpan and oversized: a giant red latex bag, tied like rubbish."""
    bpy.ops.mesh.primitive_plane_add(size=40)
    assign(bpy.context.active_object, principled("concrete", (0.03, 0.03, 0.032), rough=0.9))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 2.2, 3), rotation=(math.pi / 2, 0, 0))
    wall = bpy.context.active_object
    wall.scale = (16, 8, 1)
    assign(wall, principled("wall", (0.02, 0.02, 0.022), rough=0.95))
    latex = lacquer(RED, 0.16)
    bag = crumpled_ball("bag", 5, radius=0.95, depth=0.14)
    bag.scale = (1.0, 0.82, 1.15)
    bag.location = (0, 0, 1.0)
    assign(bag, latex)
    for i, (x, rz) in enumerate([(-0.18, 0.5), (0.2, -0.5)]):
        ear = crumpled_ball("tie%d" % i, 20 + i, radius=0.24, depth=0.25)
        ear.scale = (0.6, 0.35, 1.2)
        ear.location = (x, 0, 2.15)
        ear.rotation_euler = (0, rz, 0)
        assign(ear, latex)
    area_light("soft", (0, -5, 3.2), 6.0, 1500, target=(0, 0, 1.0))
    area_light("top", (0, 0, 6), 4.0, 400, target=(0, 0, 1.0))
    camera((0, -6.2, 1.6), (0, 0, 1.35), lens=60, focus=(0, 0, 1.0), fstop=8)


def red_drape():
    """Heavy red velvet, hung in deep folds."""
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=260, y_subdivisions=40, size=1,
                                    location=(0, 1.6, 2.5), rotation=(math.pi / 2, 0, 0))
    drape = bpy.context.active_object
    drape.scale = (9, 6, 1)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    mesh = drape.data
    n = len(mesh.vertices)
    co = np.empty(n * 3)
    mesh.vertices.foreach_get("co", co)
    p = co.reshape(n, 3)
    h = (p[:, 2] - p[:, 2].min()) / np.ptp(p[:, 2])
    p[:, 1] += (0.22 + 0.1 * h) * np.sin(p[:, 0] * 3.1 + h * 0.8) + 0.06 * np.sin(p[:, 0] * 11.0)
    mesh.vertices.foreach_set("co", p.ravel())
    mesh.update()
    for poly in mesh.polygons:
        poly.use_smooth = True
    assign(drape, velvet((0.3, 0.004, 0.012)))


def velluto():
    """VELLUTO — opulent and cinematic: a black box bag with a bamboo handle before red velvet."""
    red_drape()
    bpy.ops.mesh.primitive_plane_add(size=40)
    assign(bpy.context.active_object, velvet((0.16, 0.004, 0.008)))
    black = lacquer(BLACK, 0.12)
    rounded_box("bag", (0, 0, 0.5), (1.4, 0.55, 1.0), black, bevel=0.1)
    rounded_box("flap", (0, -0.26, 0.72), (1.42, 0.06, 0.55), black, bevel=0.05)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.05, location=(0, 0, 1.0),
                                     rotation=(math.pi / 2, 0, 0), major_segments=160, minor_segments=24)
    handle = bpy.context.active_object
    bamboo(handle)
    for poly in handle.data.polygons:
        poly.use_smooth = True
    assign(handle, lacquer((0.06, 0.012, 0.008), 0.2))
    clasp = cylinder("clasp", 0.07, 0.04, (0, -0.3, 0.55), principled("chrome", (0.8, 0.8, 0.8), rough=0.1, metal=1.0))
    clasp.rotation_euler = (math.pi / 2, 0, 0)
    for x in (-1.35, 1.35):
        cylinder("candle", 0.07, 1.2, (x, 0.4, 0.6), lacquer(RED, 0.3))
    area_light("key", (-2.5, -3.0, 3.5), 2.0, 900, (1.0, 0.82, 0.65), target=(0, 0, 0.8))
    area_light("rim", (2.6, 0.5, 2.5), 1.0, 700, (1.0, 0.4, 0.3), target=(0, 0, 0.8))
    camera((0.3, -5.4, 1.5), (0, 0, 0.95), lens=60, focus=(0, 0, 0.7), fstop=3.5)


def zero():
    """ZERO — anonymous: a black dress form with four white stitches, on red."""
    cyclorama(RED, rough=0.9)
    linen = principled("linen", BLACK, rough=0.85)
    prof = [(0.0, 0.0), (0.36, 0.0), (0.42, 0.15), (0.38, 0.4), (0.3, 0.6), (0.4, 0.85), (0.44, 1.0),
            (0.4, 1.15), (0.3, 1.25), (0.12, 1.32), (0.1, 1.42), (0.0, 1.45)]
    form = lathe("form", prof, steps=160, thickness=0.02)
    form.scale = (1.0, 0.72, 1.0)
    form.location = (0, 0, 1.3)
    assign(form, linen)
    steel = principled("steel", (0.05, 0.05, 0.05), rough=0.3, metal=1.0)
    cylinder("pole", 0.03, 1.3, (0, 0, 0.65), steel)
    for a in (0, 2.1, 4.2):
        leg = cylinder("leg", 0.022, 0.8, (0.3 * math.cos(a), 0.3 * math.sin(a), 0.1), steel)
        leg.rotation_euler = (0, math.pi / 2 - 0.25, a)
    thread = principled("thread", (0.9, 0.9, 0.88), rough=0.6)
    for x, z in [(-0.1, 2.3), (0.1, 2.3), (-0.1, 2.18), (0.1, 2.18)]:
        rounded_box("stitch", (x, -0.31, z), (0.07, 0.01, 0.018), thread, bevel=0.004, segments=2)
    area_light("key", (-3, -3.5, 4), 3.0, 1200, target=(0, 0, 1.8))
    area_light("fill", (3, -3, 2), 3.0, 300, target=(0, 0, 1.6))
    camera((0, -6.8, 2.1), (0, 0, 1.75), lens=70, focus=(0, 0, 2.0), fstop=6)


def quote():
    """“QUOTE” — a red bag that says what it is."""
    mirror_floor()
    rounded_box("bag", (0, 0, 0.62), (1.5, 0.6, 1.2), lacquer(RED, 0.22), bevel=0.06)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.36, minor_radius=0.04, location=(0, 0, 1.22), rotation=(math.pi / 2, 0, 0))
    assign(bpy.context.active_object, lacquer(BLACK, 0.2))
    label_text("“HANDBAG”", 0.2, (0, -0.305, 0.58), (math.pi / 2, 0, 0))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.008, location=(0.2, -0.02, 1.52), rotation=(0, math.pi / 2, 0))
    assign(bpy.context.active_object, principled("tie", (0.9, 0.9, 0.9), rough=0.4))
    flash(1400)
    area_light("rim", (-2.5, 2.2, 2.0), 1.2, 700, (1.0, 0.3, 0.25), target=(0, 0, 0.8))
    camera((0.9, -4.8, 1.6), (0, 0, 0.9), lens=70, focus=(0, -0.3, 0.7), fstop=4)


SCENES = {"nuit": nuit, "brut": brut, "velluto": velluto, "zero": zero, "quote": quote}


def main():
    scene = reset_scene()
    scene.view_settings.exposure = -0.2
    SCENES[SCENE_ID]()
    scene.render.image_settings.file_format = "JPEG"
    scene.render.image_settings.quality = 90
    scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print("HOUSE: wrote", OUT)


main()
