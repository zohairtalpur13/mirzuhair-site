"""“RAW” — wabi-sabi still lifes in black and red, rendered headless in Blender (Cycles).

Usage:
  Blender -b -P raw_scenes.py -- <vessel|repair|rest|book|stones> <out.jpg> [mask]

Everything is black plaster, raw stone and red lacquer, lit by one shaft of light.
Reuses the Cycles helpers from scrap/render/scrap_covers.py.
"""
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
with open(os.path.join(SITE, "scrap", "render", "scrap_covers.py"), encoding="utf-8") as fh:
    exec(compile(fh.read().rsplit("\nmain()", 1)[0], "scrap_covers.py", "exec"))  # helpers only

RED = (0.26, 0.018, 0.012)
BLACK_PLASTER = (0.028, 0.026, 0.025)


# ── Materials ────────────────────────────────────────────────

def plaster(name, color, rough=0.92, bump=0.35, scale=9.0):
    """Hand-trowelled lime plaster: uneven tone and a soft, pitted surface."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = rough
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = 12
    tone = nt.nodes.new("ShaderNodeTexNoise")
    tone.inputs["Scale"].default_value = 1.3
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*[c * 0.7 for c in color], 1)
    ramp.color_ramp.elements[1].color = (*[min(1, c * 1.6) for c in color], 1)
    nt.links.new(tone.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    bmp = nt.nodes.new("ShaderNodeBump")
    bmp.inputs["Strength"].default_value = bump
    nt.links.new(noise.outputs["Fac"], bmp.inputs["Height"])
    nt.links.new(bmp.outputs["Normal"], b.inputs["Normal"])
    return mat


def lacquer(name="lacquer"):
    return principled(name, RED, rough=0.12, coat=1.0)


def red_seams(name):
    """Black raku glaze mended with red lacquer along its cracks."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    out = nt.nodes["Material Output"]
    raku = nt.nodes["Principled BSDF"]
    raku.inputs["Base Color"].default_value = (0.015, 0.014, 0.013, 1)
    raku.inputs["Roughness"].default_value = 0.35
    raku.inputs["Coat Weight"].default_value = 0.5
    red = nt.nodes.new("ShaderNodeBsdfPrincipled")
    red.inputs["Base Color"].default_value = (*RED, 1)
    red.inputs["Roughness"].default_value = 0.1
    red.inputs["Coat Weight"].default_value = 1.0
    coord = nt.nodes.new("ShaderNodeTexCoord")
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Scale"].default_value = 2.4
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
    ramp.color_ramp.elements[1].position = 0.025
    ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(coord.outputs["Object"], vor.inputs["Vector"])
    nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], mix.inputs["Fac"])
    nt.links.new(raku.outputs["BSDF"], mix.inputs[1])
    nt.links.new(red.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return mat


# ── Geometry ─────────────────────────────────────────────────

def dense(points, per=10):
    out = []
    for (r0, z0), (r1, z1) in zip(points, points[1:]):
        for i in range(per):
            t = i / per
            out.append((r0 + (r1 - r0) * t, z0 + (z1 - z0) * t))
    out.append(points[-1])
    return out


def hand_formed(name, profile, outside, inside, wobble=0.035, seed=1):
    """A lathed vessel pushed out of true, like something formed by hand."""
    obj = lathe(name, dense(profile), steps=160, thickness=0.04)
    for mod in list(obj.modifiers):
        obj.modifiers.remove(mod)
    tex = bpy.data.textures.new(name + "-wobble", "CLOUDS")
    tex.noise_scale = 0.55
    # lathed normals face inward, so the solidified shell is the outside
    obj.data.materials.append(inside)
    obj.data.materials.append(outside)
    solid = obj.modifiers.new("thick", "SOLIDIFY")
    solid.thickness = 0.05
    solid.material_offset = 1
    obj.modifiers.new("sub", "SUBSURF").levels = 1
    disp = obj.modifiers.new("wobble", "DISPLACE")
    disp.texture = tex
    disp.strength = wobble
    disp.texture_coords = "OBJECT"
    obj.rotation_euler = (0, 0, seed * 0.7)
    return obj


def block(name, loc, size, mat, bevel=0.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    obj.modifiers.new("bevel", "BEVEL").width = bevel
    assign(obj, mat)
    return obj


def dark_room():
    """Black plaster floor and wall, a high window casting one shaft of light."""
    wall = plaster("wall", BLACK_PLASTER)
    floor = plaster("floor", (0.035, 0.032, 0.03), rough=0.8, bump=0.15, scale=5)
    bpy.ops.mesh.primitive_plane_add(size=30)
    f = bpy.context.active_object
    assign(f, floor)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 1.8, 3), rotation=(math.pi / 2, 0, 0))
    w = bpy.context.active_object
    w.scale = (14, 8, 1)
    assign(w, wall)
    if MASK:
        f.hide_render = True
        w.hide_render = True
    sun = bpy.data.lights.new("shaft", "SPOT")
    sun.energy = 2300
    sun.spot_size = math.radians(34)
    sun.spot_blend = 0.35
    sun.shadow_soft_size = 0.25
    sun.color = (1.0, 0.9, 0.78)
    s = link(bpy.data.objects.new("shaft", sun))
    s.location = (-3.2, -2.4, 5.4)
    s.rotation_euler = (Vector((0.2, 0.4, 0.6)) - s.location).to_track_quat("-Z", "Y").to_euler()
    area_light("fill", (3.5, -5.0, 2.0), 5.0, 60, (0.85, 0.9, 1.0), target=(0, 0, 0.8))
    bpy.context.scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.05


# ── Scenes ───────────────────────────────────────────────────

def scene_vessel():
    """“VESSEL” — a hand-formed black stone vessel, lacquered red inside."""
    dark_room()
    block("plinth", (0, 0, 0.3), (1.2, 1.0, 0.6), plaster("plinth", (0.05, 0.047, 0.044), bump=0.5))
    prof = [(0.0, 0.0), (0.26, 0.0), (0.4, 0.2), (0.46, 0.5), (0.42, 0.8), (0.3, 1.0), (0.22, 1.1), (0.24, 1.16)]
    v = hand_formed("vessel", prof, plaster("stone", (0.04, 0.038, 0.036), rough=0.75, bump=0.6, scale=14), lacquer())
    v.location = (0, 0, 0.6)
    camera((0, -7.0, 2.1), (0, 0, 1.55), lens=85, focus=(0, 0, 1.1), fstop=5)


def scene_repair():
    """“REPAIR” — a black raku bowl mended in red lacquer."""
    dark_room()
    block("stone", (0, 0, 0.18), (1.5, 1.1, 0.36), plaster("stone", (0.06, 0.056, 0.05), bump=0.7, scale=4))
    prof = [(0.0, 0.0), (0.22, 0.0), (0.3, 0.05), (0.5, 0.2), (0.62, 0.38), (0.66, 0.46)]
    bowl = hand_formed("bowl", prof, red_seams("raku"), red_seams("raku-in"), wobble=0.025, seed=3)
    bowl.location = (0, 0, 0.36)
    camera((0, -5.6, 2.9), (0, 0, 1.25), lens=85, focus=(0, 0, 0.6), fstop=4)


def scene_rest():
    """“REST” — a black plaster bench, one red cushion, a slot of light."""
    dark_room()
    black = plaster("bench", (0.04, 0.037, 0.035), bump=0.4)
    block("bench", (0, 0.2, 0.28), (2.6, 0.8, 0.56), black, bevel=0.08)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.35, 0.2, 0.66))
    cushion = bpy.context.active_object
    cushion.scale = (0.9, 0.62, 0.2)
    cushion.modifiers.new("bevel", "BEVEL").width = 0.08
    cushion.modifiers.new("sub", "SUBSURF").levels = 3
    assign(cushion, principled("linen", RED, rough=0.9, sss=0.05))
    camera((0.5, -4.6, 1.25), (0.1, 0.2, 0.95), lens=55, focus=(0.35, 0.2, 0.65), fstop=4)


def scene_book():
    """“THE BOOK” — a red cloth book on black plaster, after the most creative act."""
    dark_room()
    block("block", (0, 0, 0.45), (1.5, 1.2, 0.9), plaster("block", (0.045, 0.042, 0.04), bump=0.5), bevel=0.02)
    cloth = plaster("cloth", RED, rough=0.85, bump=0.12, scale=60)
    block("book", (0, -0.05, 0.94), (0.78, 1.0, 0.08), cloth, bevel=0.01)
    ink = (0.015, 0.01, 0.01)
    for body, size, y in [("THE", 0.1, 0.36), ("MOST", 0.1, 0.25), ("HONEST", 0.1, 0.14), ("OBJECT", 0.1, 0.03), ("IS", 0.1, -0.08),
                          ("THE ONE THAT", 0.045, -0.3), ("SHOWS ITS AGE", 0.045, -0.36)]:
        t = label_text(body, size, (-0.3 if size > 0.05 else 0.05, -0.05 + y, 0.982), (0, 0, 0), color=ink)
        t.data.align_x = "LEFT"
    camera((0.6, -3.0, 3.6), (0, 0.0, 0.9), lens=60, focus=(0, -0.05, 0.95), fstop=4.5)


def scene_stones():
    """“STONES” — three rough stone pots on the floor, one of them red."""
    dark_room()
    stone = plaster("stone", (0.05, 0.047, 0.043), rough=0.85, bump=0.9, scale=16)
    prof = [(0.0, 0.0), (0.3, 0.02), (0.44, 0.2), (0.46, 0.38), (0.36, 0.55), (0.14, 0.62), (0.1, 0.6)]
    pots = [(-0.9, 0.3, 1.0, stone),
            (0.15, -0.1, 0.8, plaster("red-stone", RED, rough=0.8, bump=0.9, scale=16)),
            (1.0, 0.45, 1.15, stone)]
    for i, (x, y, s, mat) in enumerate(pots):
        pot = hand_formed("pot%d" % i, prof, mat, mat, wobble=0.035, seed=i + 2)  # one stone, inside and out
        pot.scale = (s, s, s)
        pot.location = (x, y, 0)
    camera((0, -6.4, 2.4), (0, 0, 1.2), lens=70, focus=(0.15, -0.1, 0.3), fstop=6)


SCENES = {"vessel": scene_vessel, "repair": scene_repair, "rest": scene_rest,
          "book": scene_book, "stones": scene_stones}


def main():
    scene = reset_scene()
    scene.view_settings.exposure = 0.2
    SCENES[SCENE_ID]()
    fmt = scene.render.image_settings
    if MASK:
        fmt.file_format = "PNG"
        fmt.color_mode = "RGBA"
    else:
        fmt.file_format = "JPEG"
        fmt.quality = 90
    scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print("RAW: wrote", OUT)


main()
