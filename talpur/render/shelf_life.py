"""SHELF LIFE — objects from the haveli, rendered as they are, in front of their own prints.

Usage:
  Blender -b -P shelf_life.py -- <vase|ewer|goblet|cabinet> <out.jpg> [mask | turn <frames>]

`mask` renders only the objects' alpha (for the cover layout); `turn N` renders N frames
of a slow turntable to out-00.jpg … for the web flipbook.
Reuses the Cycles helpers from scrap/render/scrap_covers.py.
"""
import math
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
with open(os.path.join(SITE, "scrap", "render", "scrap_covers.py"), encoding="utf-8") as fh:
    exec(compile(fh.read().rsplit("\nmain()", 1)[0], "scrap_covers.py", "exec"))  # helpers only

TEX = os.path.join(os.path.dirname(HERE), "tex")
TURN = len(ARGS) > 3 and ARGS[2] == "turn"
TURN_FRAMES = int(ARGS[3]) if TURN else 0
GILT = (1.0, 0.74, 0.34)


# ── Shader helpers ───────────────────────────────────────────

def image_node(nt, name, extension="REPEAT", non_color=False):
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(os.path.join(TEX, name))
    tex.extension = extension
    if non_color:
        tex.image.colorspace_settings.name = "Non-Color"
    return tex


def math_node(nt, op, a, b=None, value=None):
    m = nt.nodes.new("ShaderNodeMath")
    m.operation = op
    nt.links.new(a, m.inputs[0])
    if b is not None:
        nt.links.new(b, m.inputs[1])
    elif value is not None:
        m.inputs[1].default_value = value
    return m.outputs[0]


def object_xyz(nt):
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(coord.outputs["Object"], sep.inputs[0])
    return sep


def combine_uv(nt, u, v):
    comb = nt.nodes.new("ShaderNodeCombineXYZ")
    nt.links.new(u, comb.inputs[0])
    nt.links.new(v, comb.inputs[1])
    return comb.outputs[0]


def cylinder_uv(nt, repeat_u, z0, z1, repeat_v=1.0):
    """Wrap a texture around Z: u from the angle, v from height."""
    sep = object_xyz(nt)
    ang = math_node(nt, "ARCTAN2", sep.outputs["Y"], sep.outputs["X"])
    u = math_node(nt, "MULTIPLY", math_node(nt, "ADD", math_node(nt, "DIVIDE", ang, value=math.tau), value=0.5), value=repeat_u)
    v = math_node(nt, "MULTIPLY", math_node(nt, "DIVIDE", math_node(nt, "SUBTRACT", sep.outputs["Z"], value=z0), value=z1 - z0), value=repeat_v)
    return combine_uv(nt, u, v)


def front_projection(nt, x0, x1, z0, z1):
    """Project a decal onto the front (-Y) side between x0..x1 and z0..z1."""
    sep = object_xyz(nt)
    u = math_node(nt, "DIVIDE", math_node(nt, "SUBTRACT", sep.outputs["X"], value=x0), value=x1 - x0)
    v = math_node(nt, "DIVIDE", math_node(nt, "SUBTRACT", sep.outputs["Z"], value=z0), value=z1 - z0)
    front = math_node(nt, "LESS_THAN", sep.outputs["Y"], value=0.0)
    return combine_uv(nt, u, v), front


def gold_bsdf(nt, rough=0.2):
    g = nt.nodes.new("ShaderNodeBsdfPrincipled")
    g.inputs["Base Color"].default_value = (*GILT, 1)
    g.inputs["Metallic"].default_value = 1.0
    g.inputs["Roughness"].default_value = rough
    return g


def mix_shader(nt, fac, a, b):
    m = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(fac, m.inputs["Fac"])
    nt.links.new(a, m.inputs[1])
    nt.links.new(b, m.inputs[2])
    return m.outputs[0]


def output(nt, shader):
    nt.links.new(shader, nt.nodes["Material Output"].inputs["Surface"])


# ── Materials ────────────────────────────────────────────────

def ruby_gilt(z0, z1):
    """Ruby glass with gilt tendrils (taken from the jali drawing) wrapped around it."""
    mat = bpy.data.materials.new("ruby")
    mat.use_nodes = True
    nt = mat.node_tree
    glass = nt.nodes["Principled BSDF"]
    glass.inputs["Base Color"].default_value = (0.62, 0.0, 0.03, 1)
    glass.inputs["Transmission Weight"].default_value = 1.0
    glass.inputs["Roughness"].default_value = 0.03
    glass.inputs["IOR"].default_value = 1.52
    mask = image_node(nt, "jali-gold-mask.png", non_color=True)
    nt.links.new(cylinder_uv(nt, 1.0, z0, z1, 1.3), mask.inputs["Vector"])
    # keep the gilding in loose vine-like clusters, as on the original
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 2.2
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.52
    ramp.color_ramp.elements[1].position = 0.58
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    gilt = math_node(nt, "MULTIPLY", mask.outputs["Color"], ramp.outputs["Color"])
    output(nt, mix_shader(nt, gilt, glass.outputs["BSDF"], gold_bsdf(nt, 0.28).outputs["BSDF"]))
    return mat


def ewer_porcelain(gold_below, gold_above, panel):
    """White glaze, gilt foot and collar, and the painted panel from the photograph."""
    mat = bpy.data.materials.new("ewer")
    mat.use_nodes = True
    nt = mat.node_tree
    glaze = nt.nodes["Principled BSDF"]
    glaze.inputs["Base Color"].default_value = (0.92, 0.91, 0.87, 1)
    glaze.inputs["Roughness"].default_value = 0.07
    glaze.inputs["Coat Weight"].default_value = 0.8
    glaze.inputs["Subsurface Weight"].default_value = 0.05
    uv, front = front_projection(nt, *panel)
    paint = image_node(nt, "ewer-panel.jpg", extension="CLIP")
    nt.links.new(uv, paint.inputs["Vector"])
    painted = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(paint.outputs["Color"], painted.inputs["Base Color"])
    painted.inputs["Roughness"].default_value = 0.08
    painted.inputs["Coat Weight"].default_value = 0.8
    body = mix_shader(nt, math_node(nt, "MULTIPLY", paint.outputs["Alpha"], front),
                      glaze.outputs["BSDF"], painted.outputs["BSDF"])
    sep = object_xyz(nt)
    band = math_node(nt, "MAXIMUM",
                     math_node(nt, "LESS_THAN", sep.outputs["Z"], value=gold_below),
                     math_node(nt, "GREATER_THAN", sep.outputs["Z"], value=gold_above))
    output(nt, mix_shader(nt, band, body, gold_bsdf(nt, 0.22).outputs["BSDF"]))
    return mat


def cut_green(z0, z1):
    """Green overlay glass cut through to clear in a diamond lattice."""
    mat = bpy.data.materials.new("cutglass")
    mat.use_nodes = True
    nt = mat.node_tree
    green = nt.nodes["Principled BSDF"]
    green.inputs["Base Color"].default_value = (0.02, 0.42, 0.14, 1)
    green.inputs["Transmission Weight"].default_value = 1.0
    green.inputs["Roughness"].default_value = 0.04
    clear = nt.nodes.new("ShaderNodeBsdfPrincipled")
    clear.inputs["Base Color"].default_value = (0.97, 0.97, 0.94, 1)
    clear.inputs["Transmission Weight"].default_value = 1.0
    clear.inputs["Roughness"].default_value = 0.12
    lattice = image_node(nt, "lattice-mask.png", non_color=True)
    nt.links.new(cylinder_uv(nt, 1.0, z0, z1), lattice.inputs["Vector"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    nt.links.new(lattice.outputs["Color"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], green.inputs["Normal"])
    nt.links.new(bump.outputs["Normal"], clear.inputs["Normal"])
    output(nt, mix_shader(nt, lattice.outputs["Color"], green.outputs["BSDF"], clear.outputs["BSDF"]))
    return mat


def print_silk(name):
    """The repeat, printed on silk."""
    mat = bpy.data.materials.new("silk")
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.55
    b.inputs["Sheen Weight"].default_value = 0.6
    img = image_node(nt, name)
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1.6, 1.7, 1)
    coord = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(coord.outputs["UV"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], img.inputs["Vector"])
    nt.links.new(img.outputs["Color"], b.inputs["Base Color"])
    return mat


# ── Geometry ─────────────────────────────────────────────────

def scallop(obj, below, depth, lobes):
    """Scallop a lathed foot like cut glass: vertices below `below` flare in lobes."""
    mesh = obj.data
    n = len(mesh.vertices)
    co = np.empty(n * 3)
    mesh.vertices.foreach_get("co", co)
    p = co.reshape(n, 3)
    ang = np.arctan2(p[:, 1], p[:, 0])
    k = np.clip((below - p[:, 2]) / below, 0, 1)
    s = 1 + depth * k * np.abs(np.cos(ang * lobes / 2))
    p[:, 0] *= s
    p[:, 1] *= s
    mesh.vertices.foreach_set("co", p.ravel())
    mesh.update()


def lathe_dense(name, pts):
    prof = []
    for (r0, z0), (r1, z1) in zip(pts, pts[1:]):
        for t in np.linspace(0, 1, 10, endpoint=False):
            prof.append((r0 + (r1 - r0) * t, z0 + (z1 - z0) * t))
    prof.append(pts[-1])
    obj = lathe(name, prof, steps=160)
    for mod in list(obj.modifiers):
        obj.modifiers.remove(mod)
    return obj


def finish(obj, thickness):
    obj.modifiers.new("thick", "SOLIDIFY").thickness = thickness
    obj.modifiers.new("sub", "SUBSURF").levels = 1


def tube(name, pts, radius, mat, taper=None):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 6
    sp = curve.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    for i, (bp, co) in enumerate(zip(sp.bezier_points, pts)):
        bp.co = co
        bp.handle_left_type = bp.handle_right_type = "AUTO"
        if taper:
            bp.radius = taper[i]
    obj = link(bpy.data.objects.new(name, curve))
    obj.data.materials.append(mat)
    return obj


def room(pattern, plinth_radius=0.62):
    """Dark polished floor, a plaster plinth, and the print hung behind like a silk panel."""
    bpy.ops.mesh.primitive_plane_add(size=40)
    floor = bpy.context.active_object
    assign(floor, principled("stone", (0.02, 0.018, 0.016), rough=0.25, coat=0.4))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 1.6, 2.2), rotation=(math.pi / 2, 0, 0))
    panel = bpy.context.active_object
    panel.scale = (4.4, 4.4, 1)
    assign(panel, print_silk(pattern))
    hidden = [floor, panel]
    if plinth_radius > 0:
        bpy.ops.mesh.primitive_cylinder_add(radius=plinth_radius, depth=0.5, location=(0, 0, 0.25), vertices=96)
        plinth = bpy.context.active_object
        assign(plinth, principled("plaster", (0.3, 0.27, 0.24), rough=0.85))
        hidden.append(plinth)
    if MASK:
        for o in hidden:
            o.hide_render = True
    return 0.5


def lights(key=900):
    area_light("key", (-3.0, -2.6, 4.0), 2.2, key, (1.0, 0.93, 0.84), target=(0, 0, 1.2))
    area_light("rim", (2.8, 1.0, 2.8), 1.2, key * 0.9, (1.0, 0.96, 0.9), target=(0, 0, 1.2))
    area_light("fill", (3.0, -4.0, 1.4), 4.0, key * 0.12, target=(0, 0, 1.0))
    area_light("panel", (0, -1.0, 5.0), 3.0, key * 0.35, target=(0, 1.6, 2.0))


# ── Objects ──────────────────────────────────────────────────

def make_vase(top, x=0.0):
    pts = [(0.0, 0.0), (0.34, 0.0), (0.36, 0.05), (0.3, 0.1), (0.2, 0.16), (0.19, 0.3), (0.22, 0.6),
           (0.27, 0.95), (0.35, 1.28), (0.47, 1.52), (0.54, 1.6)]
    vase = lathe_dense("vase", pts)
    scallop(vase, 0.12, 0.06, 12)
    finish(vase, 0.022)
    vase.location = (x, 0, top)
    assign(vase, ruby_gilt(0.15, 1.55))
    return vase


def make_ewer(top, x=0.0):
    pts = [(0.0, 0.0), (0.3, 0.0), (0.31, 0.06), (0.25, 0.1), (0.22, 0.18), (0.3, 0.3), (0.42, 0.55),
           (0.46, 0.8), (0.42, 1.05), (0.34, 1.22), (0.3, 1.3), (0.34, 1.42), (0.37, 1.5)]
    ewer = lathe_dense("ewer", pts)
    finish(ewer, 0.02)
    mat = ewer_porcelain(0.19, 1.26, (-0.3, 0.3, 0.42, 1.12))
    assign(ewer, mat)
    gold = principled("gold", GILT, rough=0.2, metal=1.0)
    spout = tube("spout", [(0.4, 0, 0.95), (0.6, 0, 1.2), (0.62, 0, 1.52), (0.74, 0, 1.64)], 0.05, gold, [1.3, 0.9, 0.7, 0.55])
    handle = tube("handle", [(-0.34, 0, 1.36), (-0.62, 0, 1.28), (-0.6, 0, 0.9), (-0.42, 0, 0.62)], 0.035, mat)
    root = link(bpy.data.objects.new("ewer-root", None))
    for o in (ewer, spout, handle):
        parent_to(o, root)
    root.location = (x, 0, top)
    return root


def make_goblet(top, x=0.0):
    pts = [(0.0, 0.0), (0.28, 0.0), (0.3, 0.02), (0.25, 0.05), (0.08, 0.1), (0.06, 0.2), (0.11, 0.3),
           (0.12, 0.36), (0.07, 0.44), (0.05, 0.55), (0.1, 0.63), (0.21, 0.72), (0.27, 0.92), (0.29, 1.12), (0.31, 1.2)]
    gob = lathe_dense("goblet", pts)
    scallop(gob, 0.04, 0.05, 10)
    finish(gob, 0.02)
    gob.scale = (1.15, 1.15, 1.15)
    gob.location = (x, 0, top)
    assign(gob, cut_green(0.66, 1.2))
    return gob


def make_cabinet(top):
    """All three together on one long plinth: the cabinet as it stood."""
    root = link(bpy.data.objects.new("cabinet", None))
    for obj in (make_ewer(top, -1.3), make_vase(top, 0.05), make_goblet(top, 1.12)):
        parent_to(obj, root)
    return root


# ── Objects wrapped in their own photographs ─────────────────

def photo_wrap(name, image, x0, x1, z0, z1, glow=0.0, coat=1.0):
    """Project the object's photograph straight through it (front and back) as its surface."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.1
    b.inputs["Coat Weight"].default_value = coat
    uv, _ = front_projection(nt, x0, x1, z0, z1)
    tex = image_node(nt, image, extension="EXTEND")
    nt.links.new(uv, tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    if glow:
        nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"])
        b.inputs["Emission Strength"].default_value = glow
    return mat


def make_lantern(top, x=0.0):
    """The yellow enamelled hanging lantern, jewels and all, hung from a chain."""
    brass = principled("brass", (0.62, 0.48, 0.26), rough=0.35, metal=1.0)
    body_pts = [(0.0, 0.0), (0.12, 0.02), (0.28, 0.12), (0.36, 0.3), (0.38, 0.5), (0.36, 0.68), (0.31, 0.78)]
    body = lathe_dense("lantern", body_pts)
    finish(body, 0.02)
    assign(body, photo_wrap("lantern-skin", "lantern-body.jpg", -0.38, 0.38, 0.0, 0.8, glow=0.35))
    cap = lathe_dense("cap", [(0.0, 1.1), (0.36, 1.06), (0.42, 1.02), (0.43, 1.035)])
    finish(cap, 0.015)
    assign(cap, principled("opaline", (0.93, 0.92, 0.86), rough=0.15, sss=0.3))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.315, minor_radius=0.025, location=(0, 0, 0.78))
    band = bpy.context.active_object
    assign(band, brass)
    finial = lathe_dense("finial", [(0.0, -0.22), (0.03, -0.18), (0.07, -0.1), (0.09, -0.02), (0.1, 0.02)])
    finish(finial, 0.01)
    assign(finial, brass)
    parts = [body, cap, band, finial]
    for ang in (0.3, 2.4, 4.5):
        cx, cy = 0.31 * math.cos(ang), 0.31 * math.sin(ang)
        parts.append(tube("chain", [(cx, cy, 0.8), (cx * 0.2, cy * 0.2, 1.08)], 0.008, brass))
    parts.append(tube("rod", [(0, 0, 1.1), (0, 0, 3.5)], 0.012, brass))
    root = link(bpy.data.objects.new("lantern-root", None))
    for o in parts:
        parent_to(o, root)
    root.scale = (1.35, 1.35, 1.35)
    root.location = (x, 0, top + 0.75)
    return root


def make_clock(top, x=0.0):
    """The carved mantel clock: its photograph, cut out, on a dark wooden body for depth."""
    h = 1.95
    w = h * 2465 / 2943
    bpy.ops.mesh.primitive_plane_add(size=1, location=(x, -0.26, top + h / 2 - 0.13), rotation=(math.pi / 2, 0, 0))
    card = bpy.context.active_object
    card.scale = (w, h, 1)
    mat = bpy.data.materials.new("clock-face")
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.35
    b.inputs["Coat Weight"].default_value = 0.5
    tex = image_node(nt, "clock-cut.png", extension="CLIP")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(coord.outputs["UV"], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    nt.links.new(tex.outputs["Alpha"], b.inputs["Alpha"])
    assign(card, mat)
    wood = principled("walnut", (0.07, 0.035, 0.02), rough=0.3, coat=0.6)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0.0, top + 0.7))
    box = bpy.context.active_object
    box.scale = (w * 0.56, 0.46, 1.2)
    box.modifiers.new("bevel", "BEVEL").width = 0.02
    assign(box, wood)
    root = link(bpy.data.objects.new("clock-root", None))
    for o in (card, box):
        parent_to(o, root)
    return root


def make_urn(top, x=0.0):
    """The Bohemian ruby-and-gilt decanter with its tall stopper, wrapped in its photograph."""
    pts = [(0.0, 0.0), (0.3, 0.0), (0.33, 0.25), (0.36, 0.5), (0.32, 0.75), (0.2, 0.9), (0.1, 0.97),
           (0.12, 1.02), (0.1, 1.08), (0.12, 1.14), (0.1, 1.2), (0.12, 1.26), (0.2, 1.31), (0.12, 1.36),
           (0.19, 1.45), (0.08, 1.56), (0.05, 1.8), (0.03, 2.2), (0.0, 2.24)]
    urn = lathe_dense("urn", pts)
    finish(urn, 0.02)
    urn.location = (x, 0, top)
    assign(urn, photo_wrap("urn-skin", "urn-body.jpg", -0.37, 0.37, 0.0, 2.24))
    return urn


def make_cranberry(top, x=0.0):
    """The cranberry-pink fluted vase with gilt ferns, wrapped in its photograph."""
    pts = [(0.0, 0.0), (0.2, 0.0), (0.22, 0.05), (0.2, 0.12), (0.27, 0.45), (0.32, 0.85), (0.31, 1.15),
           (0.24, 1.42), (0.2, 1.55), (0.26, 1.68), (0.34, 1.78)]
    vase = lathe_dense("cranberry", pts)
    finish(vase, 0.02)
    vase.location = (x, 0, top)
    assign(vase, photo_wrap("cranberry-skin", "cranberry-body.jpg", -0.34, 0.34, 0.0, 1.78))
    return vase


OBJECTS = {
    "vase": (make_vase, "carriage-verdigris-oxblood.jpg", 1.8, 0.62, 8.6),
    "ewer": (make_ewer, "clock-ivory-oxblood.jpg", 1.7, 0.62, 8.4),
    "goblet": (make_goblet, "jali-gold-emerald.jpg", 1.45, 0.62, 7.2),
    "cabinet": (make_cabinet, "chandelier-amber-charcoal.jpg", 1.85, 2.1, 13.8),
    "lantern": (make_lantern, "clock-saffron-indigo.jpg", 1.85, 0.0, 7.6),
    "clock": (make_clock, "carriage-bronze-charcoal.jpg", 1.75, 0.95, 8.8),
    "urn": (make_urn, "chandelier-emerald-plum.jpg", 1.9, 0.62, 9.2),
    "cranberry": (make_cranberry, "stairwell-rose-aubergine.jpg", 1.7, 0.62, 8.6),
}


def main():
    make, pattern, look_z, plinth_r, dist = OBJECTS[SCENE_ID]
    scene = reset_scene()
    scene.view_settings.exposure = -0.4
    scene.cycles.transmission_bounces = 16
    scene.cycles.max_bounces = 16
    top = room(pattern, plinth_r)
    hero = make(top)
    lights()
    camera((0, -dist, 2.0), (0, 0, look_z), lens=85, focus=(0, 0, look_z), fstop=4.5)
    fmt = scene.render.image_settings
    if MASK:
        fmt.file_format = "PNG"
        fmt.color_mode = "RGBA"
    else:
        fmt.file_format = "JPEG"
        fmt.quality = 90
    if not TURN:
        scene.render.filepath = OUT
        bpy.ops.render.render(write_still=True)
        print("SHELF: wrote", OUT)
        return
    scene.render.resolution_percentage = 64
    scene.cycles.samples = 64
    base = OUT.rsplit(".", 1)[0]
    for f in range(TURN_FRAMES):
        hero.rotation_euler = (0, 0, math.tau * f / TURN_FRAMES)
        scene.render.filepath = "%s-%02d.jpg" % (base, f)
        bpy.ops.render.render(write_still=True)
    print("SHELF: wrote turntable", base)


main()
