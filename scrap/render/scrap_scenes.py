"""SCRAP — product, invitation, interior and editorial scenes.

Usage:
  Blender -b -P scrap_scenes.py -- <scene> <out.jpg>

Scenes: home, vase, bin, invite, binroom, earrings, plate, bagdetail.
Reuses the materials and geometry helpers from scrap_covers.py.
"""
import math
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HERE, "scrap_covers.py"), encoding="utf-8") as fh:
    _src = fh.read()
exec(compile(_src.rsplit("\nmain()", 1)[0], "scrap_covers.py", "exec"))  # helpers only

IMG = os.path.join(os.path.dirname(HERE), "img")


def crumple_displace(obj, seed, depth):
    """Push a mesh in and out along its radial direction with straight paper creases."""
    mesh = obj.data
    n = len(mesh.vertices)
    co = np.empty(n * 3)
    mesh.vertices.foreach_get("co", co)
    p = co.reshape(n, 3)
    radial = p.copy()
    radial[:, 2] = 0
    rlen = np.linalg.norm(radial, axis=1, keepdims=True)
    radial = radial / np.maximum(rlen, 1e-6)
    unit = p / max(np.abs(p).max(), 1e-6)
    rng = np.random.default_rng(seed)
    k = 60
    normals = rng.normal(size=(k, 3))
    normals /= np.linalg.norm(normals, axis=1, keepdims=True)
    offset = (rng.random(k) - 0.5) * 1.6
    amp = rng.random(k) - 0.5
    lim = 0.03 + rng.random(k) * 0.2
    disp = np.zeros(n)
    for i in range(k):
        disp += amp[i] * np.minimum(np.abs(unit @ normals[i] - offset[i]), lim[i])
    disp -= disp.mean()
    disp /= np.abs(disp).max()
    p += radial * (disp * depth)[:, None]
    mesh.vertices.foreach_set("co", p.ravel())
    mesh.update()
    mesh.set_sharp_from_angle(angle=math.radians(24))


def dense_profile(points, per_segment=24):
    out = []
    for (r0, z0), (r1, z1) in zip(points, points[1:]):
        for t in np.linspace(0, 1, per_segment, endpoint=False):
            out.append((r0 + (r1 - r0) * t, z0 + (z1 - z0) * t))
    out.append(points[-1])
    return out


def crumpled_vase(name, seed, height=1.4):
    prof = dense_profile([(0.0, 0.0), (0.34, 0.0), (0.46, 0.35 * height), (0.4, 0.72 * height),
                          (0.22, 0.9 * height), (0.24, height)])
    vase = lathe(name, prof, steps=180, thickness=0.03)
    for mod in list(vase.modifiers):
        vase.modifiers.remove(mod)
    crumple_displace(vase, seed, 0.07)
    vase.modifiers.new("thick", "SOLIDIFY").thickness = 0.03
    return vase


def ceramic_bin(name):
    prof = dense_profile([(0.0, 0.0), (0.4, 0.0), (0.5, 0.95), (0.52, 1.0)])
    return lathe(name, prof, steps=160, thickness=0.035)


def gold_text(body, size, loc, rot):
    t = label_text(body, size, loc, rot)
    assign(t, principled("gold", GOLD, rough=0.22, metal=1.0))
    t.data.extrude = 0.004
    return t


def studio_wide(key=900):
    area_light("key", (-4.5, -3.5, 4.5), 4.0, key, (1.0, 0.95, 0.88), target=(0, 0, 0.4))
    area_light("rim", (4.0, 2.5, 3.2), 2.0, key * 0.6, (0.9, 0.95, 1.0), target=(0, 0, 0.4))
    area_light("fill", (3.5, -5.0, 1.5), 5.0, key * 0.2, target=(0, 0, 0.4))


# ── SCRAP HOME ───────────────────────────────────────────────

def scene_home():
    """The SCRAP HOME line-up on a long plinth."""
    reset_scene(res=(1600, 1067))
    cyclorama((0.28, 0.25, 0.21))
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.2))
    plinth = bpy.context.active_object
    plinth.scale = (4.6, 1.2, 0.4)
    plinth.modifiers.new("bevel", "BEVEL").width = 0.01
    assign(plinth, principled("plaster", (0.72, 0.7, 0.66), rough=0.9))
    top = 0.4
    vase = crumpled_vase("vase", 4, height=1.3)
    vase.location = (-1.55, 0.1, top)
    assign(vase, principled("black", (0.012, 0.012, 0.012), rough=0.07, coat=1.0))
    ball = crumpled_ball("ball", 7, radius=0.36)
    ball.location = (-0.45, -0.1, top + 0.3)
    assign(ball, ridge_gilded("porcelain", PORCELAIN))
    b = ceramic_bin("bin")
    b.location = (0.65, 0.15, top)
    b.scale = (0.8, 0.8, 0.8)
    assign(b, principled("porcelain2", PORCELAIN, rough=0.1, coat=0.8, sss=0.06))
    for i, (x, y) in enumerate([(0.55, 0.1), (0.8, 0.25)]):
        s = crumpled_ball("inbin%d" % i, 30 + i, radius=0.17)
        s.location = (x, y, top + 0.78)
        assign(s, principled("paper", (0.9, 0.89, 0.86), rough=0.75))
    gold_ball = crumpled_ball("gold", 13, radius=0.15)
    gold_ball.location = (1.7, -0.2, top + 0.13)
    assign(gold_ball, principled("goldm", GOLD, rough=0.16, metal=1.0))
    bisque = crumpled_ball("bisque", 11, radius=0.22)
    bisque.location = (2.15, 0.15, top + 0.2)
    assign(bisque, principled("bisque", (0.82, 0.76, 0.68), rough=0.85))
    studio_wide(1300)
    camera((0.2, -9.5, 2.4), (0.2, 0, 0.9), lens=60, focus=(0, 0, 0.8), fstop=9)


def scene_vase():
    reset_scene()
    cyclorama((0.62, 0.3, 0.12))
    vase = crumpled_vase("vase", 4, height=1.6)
    assign(vase, principled("black", (0.012, 0.012, 0.012), rough=0.06, coat=1.0))
    studio(key=1300, rim=1200)
    camera((0, -7.4, 1.9), (0, 0, 1.1), lens=85, focus=(0, 0, 0.8), fstop=6)


def scene_bin():
    reset_scene()
    cyclorama((0.1, 0.1, 0.1))
    b = ceramic_bin("bin")
    b.scale = (1.1, 1.1, 1.1)
    assign(b, principled("porcelain", PORCELAIN, rough=0.1, coat=0.8, sss=0.06))
    rim = lathe("rim", dense_profile([(0.56, 1.03), (0.585, 1.06)], 4), steps=160, thickness=0.02)
    rim.scale = (1.0, 1.0, 1.02)
    assign(rim, principled("gold", GOLD, rough=0.2, metal=1.0))
    word = gold_text("SCRAP", 0.2, (0, -0.548, 0.6), (math.pi / 2 - 0.105, 0, 0))
    word.name = "SCRAP mark"
    for i, (x, y, z) in enumerate([(-0.1, 0.0, 1.2), (0.22, 0.1, 1.15), (-0.75, -0.6, 0.2), (0.85, -0.4, 0.2)]):
        s = crumpled_ball("paper%d" % i, 40 + i, radius=0.22)
        s.location = (x, y, z)
        assign(s, principled("paper", (0.9, 0.89, 0.86), rough=0.75, sss=0.1))
    studio(key=1100, rim=1200)
    camera((0, -7.6, 2.4), (0, 0, 1.0), lens=85, focus=(0, -0.5, 0.6), fstop=7)


# ── Invitation ───────────────────────────────────────────────

def scene_invite():
    """Blind-embossed cotton card: no ink, the words are raised paper caught by raking light."""
    reset_scene(res=(1600, 1067))
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
    assign(bpy.context.active_object, principled("linen", (0.06, 0.055, 0.05), rough=0.95))
    cotton = principled("cotton", (0.88, 0.86, 0.81), rough=0.92, sss=0.05)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.2, 0, 0.006))
    card = bpy.context.active_object
    card.scale = (2.6, 1.8, 0.012)
    card.rotation_euler = (0, 0, 0.06)
    card.modifiers.new("bevel", "BEVEL").width = 0.004
    assign(card, cotton)
    lines = [("SCRAP", 0.52, 0.45), ("ISSUE 01  ·  THE BIN ROOM", 0.09, -0.12),
             ("OPENING NIGHT", 0.09, -0.3), ("NOTHING IS EVER REALLY GONE", 0.07, -0.62)]
    for body, size, y in lines:
        t = label_text(body, size, (0.2, y, 0.013), (0, 0, 0.06))
        t.data.extrude = 0.006
        t.data.bevel_depth = 0.004
        assign(t, cotton)
    env = crumpled_ball("envelope", 50, radius=0.5, depth=0.12)
    env.scale = (2.0, 1.4, 0.06)
    env.location = (-1.5, 1.3, 0.02)
    env.rotation_euler = (0, 0, -0.35)
    assign(env, principled("glassine", (0.95, 0.95, 0.93), rough=0.35, transmission=0.6))
    seal = crumpled_ball("seal", 51, radius=0.14, depth=0.1)
    seal.scale = (1, 1, 0.25)
    seal.location = (1.95, -0.95, 0.03)
    assign(seal, principled("goldm", GOLD, rough=0.25, metal=1.0))
    area_light("rake", (-6, 0.5, 0.9), 1.5, 1600, (1.0, 0.93, 0.84), target=(0.2, 0, 0))
    area_light("soft", (0, -2, 6), 6, 120, target=(0, 0, 0))
    camera((0.5, -3.2, 5.6), (0.1, 0.05, 0), lens=50, focus=(0.2, 0, 0), fstop=8)


# ── The Bin Room ─────────────────────────────────────────────

def image_plane(path, loc, rot, height):
    img = bpy.data.images.load(path)
    w, h = img.size
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    plane = bpy.context.active_object
    plane.scale = (height * w / h, height, 1)
    mat = bpy.data.materials.new("print")
    mat.use_nodes = True
    nt = mat.node_tree
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.6
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    assign(plane, mat)
    return plane


def scene_binroom():
    """A white gallery, the floor ankle-deep in crumpled paper, the covers hung perfectly."""
    reset_scene(res=(1600, 900))
    bpy.context.scene.view_settings.exposure = -0.6
    wall = principled("wall", (0.8, 0.79, 0.76), rough=0.9)
    for loc, rot, scale in [((0, 0, 0), (0, 0, 0), (14, 12, 1)),
                            ((0, 5, 3), (math.pi / 2, 0, 0), (14, 6, 1)),
                            ((-6.5, 0, 3), (math.pi / 2, 0, math.pi / 2), (12, 6, 1)),
                            ((6.5, 0, 3), (math.pi / 2, 0, math.pi / 2), (12, 6, 1))]:
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
        p = bpy.context.active_object
        p.scale = scale
        assign(p, wall)
    for i in range(1, 6):
        path = os.path.join(IMG, "cover-0%d.jpg" % i)
        if not os.path.exists(path):
            path = os.path.join(IMG, "issue-0%d.jpg" % i)
        if os.path.exists(path):
            image_plane(path, (-4.4 + (i - 1) * 2.2, 4.97, 2.3), (math.pi / 2, 0, 0), 1.35)
    paper = principled("paper", (0.9, 0.89, 0.86), rough=0.75, sss=0.08)
    protos = []
    for s in range(4):
        b = crumpled_ball("proto%d" % s, 60 + s, radius=0.16, subdiv=5)
        assign(b, paper)
        b.hide_render = True
        b.location = (0, 0, -5)
        protos.append(b)
    rng = np.random.default_rng(3)
    for i in range(700):
        x = rng.uniform(-6.3, 6.3)
        y = rng.uniform(-6, 4.8)
        sc = rng.uniform(0.7, 1.4)
        rot = tuple(rng.uniform(0, math.tau, 3))
        lift = rng.uniform(0, 0.12)
        if abs(x) < 0.9 and y < 1.5:  # a path through the paper
            continue
        dup = link(bpy.data.objects.new("p%d" % i, protos[i % 4].data))
        dup.scale = (sc, sc, sc)
        dup.location = (x, y, 0.12 * sc + lift)
        dup.rotation_euler = rot
    plaster = principled("plaster", (0.86, 0.85, 0.82), rough=0.9)
    pieces = [(-2.2, 1.8, ridge_gilded("porc", PORCELAIN)),
              (2.2, 1.8, ridge_gilded("black", (0.012, 0.012, 0.012), 0.06, 0.528)),
              (0.0, 2.6, principled("goldm", GOLD, rough=0.16, metal=1.0))]
    for n, (x, y, mat) in enumerate(pieces):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, 0.55))
        pl = bpy.context.active_object
        pl.scale = (0.7, 0.7, 1.1)
        assign(pl, plaster)
        obj = crumpled_ball("piece%d" % n, 70 + n, radius=0.26)
        obj.location = (x, y, 1.36)
        assign(obj, mat)
    for n, x in enumerate((-3.5, 0, 3.5)):
        area_light("sky%d" % n, (x, 0.5, 5.9), 3.0, 900, (1.0, 0.97, 0.92), target=(x, 0.5, 0))
    area_light("window", (-6.4, -1, 3), 4, 1200, (1.0, 0.9, 0.78), target=(0, 1, 0.5))
    camera((0.3, -6.0, 1.7), (0, 3.5, 1.4), lens=24, focus=(0, 1.8, 1.0), fstop=11)


# ── Editorial details ────────────────────────────────────────

def scene_earrings():
    """A pair of gilded crumpled earrings on black mirror."""
    reset_scene()
    bpy.ops.mesh.primitive_plane_add(size=30)
    assign(bpy.context.active_object, principled("mirror", (0.01, 0.01, 0.01), rough=0.05, coat=1.0))
    gold = principled("gold", GOLD, rough=0.15, metal=1.0)
    for i, (x, y) in enumerate([(-0.28, 0.1), (0.3, -0.15)]):
        b = crumpled_ball("e%d" % i, 13 + i, radius=0.24)
        b.location = (x, y, 0.2)
        assign(b, gold)
        curve = bpy.data.curves.new("hook%d" % i, "CURVE")
        curve.dimensions = "3D"
        curve.bevel_depth = 0.012
        sp = curve.splines.new("BEZIER")
        sp.bezier_points.add(2)
        pts = [(x, y + 0.22, 0.2), (x + 0.1, y + 0.55, 0.05), (x - 0.12, y + 0.65, 0.012)]
        for bp, co in zip(sp.bezier_points, pts):
            bp.co = co
            bp.handle_left_type = bp.handle_right_type = "AUTO"
        h = link(bpy.data.objects.new("hook%d" % i, curve))
        h.data.materials.append(gold)
    area_light("key", (-2.5, -1.5, 3), 1.2, 500, (1.0, 0.92, 0.8), target=(0, 0, 0.2))
    area_light("rim", (2.5, 2.5, 1.2), 0.8, 450, (0.9, 0.95, 1.0), target=(0, 0, 0.2))
    camera((0, -3.4, 2.4), (0, 0.15, 0.1), lens=70, focus=(0, 0, 0.2), fstop=4)


def scene_plate():
    """Macro: gold seams across a mended plate."""
    reset_scene()
    cyclorama((0.02, 0.05, 0.33))
    profile = [(0.0, 0.0), (0.55, 0.0), (0.62, 0.02), (0.82, 0.07), (1.0, 0.1), (1.02, 0.11)]
    plate = lathe("plate", profile)
    plate.location = (0, 0, 0.02)
    assign(plate, kintsugi("kintsugi", PORCELAIN, scale=2.2))
    area_light("key", (-2.5, -2, 3.5), 2.0, 700, (1.0, 0.94, 0.86), target=(0, 0, 0))
    area_light("rim", (2.5, 2.5, 2), 1.5, 400, target=(0, 0, 0))
    camera((0.5, -1.6, 2.4), (0.3, 0.1, 0.05), lens=70, focus=(0.3, 0.1, 0.1), fstop=2.8)


def scene_bagdetail():
    """Macro: the red zip tie on the porcelain handle."""
    reset_scene()
    issue_2()
    cam = bpy.context.scene.camera
    cam.data.lens = 150
    target = Vector((0.0, -0.15, 1.3))
    cam.location = (0.9, -3.4, 1.9)
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam.data.dof.focus_distance = (target - cam.location).length
    cam.data.dof.aperture_fstop = 3.2


def curl(points, flat_len, radius, tighten):
    """Lay a strip flat for flat_len, then roll the rest up into a tightening spiral."""
    x, y, z = points[:, 0], points[:, 1], points[:, 2]
    theta = np.maximum(y - flat_len, 0) / radius
    r = np.maximum(radius - tighten * theta, 0.05) - z
    rolled = y > flat_len
    ny = np.where(rolled, flat_len + r * np.sin(theta), y)
    nz = np.where(rolled, radius - r * np.cos(theta), z)
    return np.stack([x, ny, nz], axis=1)


def warp_object(obj, fn):
    mesh = obj.data
    n = len(mesh.vertices)
    co = np.empty(n * 3)
    mesh.vertices.foreach_get("co", co)
    mesh.vertices.foreach_set("co", fn(co.reshape(n, 3)).ravel())
    mesh.update()


def scene_receipt():
    """PROOF OF PURCHASE — a till receipt cast in porcelain, curling off the plinth."""
    reset_scene()
    cyclorama((0.16, 0.15, 0.14))
    length, width = 3.2, 0.62
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=8, y_subdivisions=260, size=1)
    strip = bpy.context.active_object
    strip.scale = (width, length, 1)
    bpy.ops.object.transform_apply(scale=True)
    warp_object(strip, lambda p: p + np.array([0, length / 2, 0]))
    lines = ["SCRAP", "ISSUE 01", "- - - - - - - - - - - -", "1 x CRUMPLED PAGE     0.00",
             "1 x IDEA        PRICELESS", "CHANGE              3%", "- - - - - - - - - - - -",
             "TOTAL       NOTHING NEW", "", "KEEP YOUR RECEIPT"]
    parts = [strip]
    for i, body in enumerate(lines):
        if not body:
            continue
        t = label_text(body, 0.14 if i == 0 else 0.058, (0, 0.3 + (len(lines) - 1 - i) * 0.13, 0.002), (0, 0, 0))
        t.data.extrude = 0.0
        t.data.align_x = "CENTER"
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = t
        t.select_set(True)
        bpy.ops.object.convert(target="MESH")
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        parts.append(t)
    porcelain = principled("porcelain", PORCELAIN, rough=0.12, coat=0.8, sss=0.06)
    assign(strip, porcelain)
    strip.modifiers.new("thick", "SOLIDIFY").thickness = 0.012
    for part in parts:
        warp_object(part, lambda p: curl(p, 1.55, 0.34, 0.035))
        part.location = (0.1, -1.1, 0.013)
        part.rotation_euler = (0, 0, 0.35)
        for poly in part.data.polygons:
            poly.use_smooth = True
    studio(key=1300, rim=1100)
    camera((0.2, -6.4, 3.0), (0.1, 0.0, 0.4), lens=70, focus=(0.1, -0.3, 0.2), fstop=7)


EXTRA = {"receipt": scene_receipt, "home": scene_home, "vase": scene_vase, "bin": scene_bin, "invite": scene_invite,
         "binroom": scene_binroom, "earrings": scene_earrings, "plate": scene_plate,
         "bagdetail": scene_bagdetail}


def run():
    EXTRA[SCENE_ID]()
    scene = bpy.context.scene
    scene.render.image_settings.file_format = "JPEG"
    scene.render.image_settings.quality = 90
    scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print("SCRAP: wrote", OUT)


run()
