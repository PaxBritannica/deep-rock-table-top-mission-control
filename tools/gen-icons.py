"""Generates the Mission Control field-manual icon set (original artwork).

Three families, 48x48 viewBox:
  token  - round status token, tinted disc + ink glyph
  die    - rounded-square die face, tinted + ink glyph
  action - plain ink line glyph (inherits currentColor)

Writes src/app/core/ui/fm-icons.data.ts (and optionally a preview HTML page).

Usage:  python3 tools/gen-icons.py . [preview.html]
"""
import math, sys, json

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
PREVIEW = sys.argv[2] if len(sys.argv) > 2 else None

def f(x):
    return f"{x:.1f}".rstrip('0').rstrip('.')

def star(cx, cy, r_out, r_in, n=5, rot=-90):
    pts = []
    for i in range(n * 2):
        r = r_out if i % 2 == 0 else r_in
        a = math.radians(rot + i * 180 / n)
        pts.append(f"{f(cx + r * math.cos(a))},{f(cy + r * math.sin(a))}")
    return "M" + " L".join(pts) + "Z"

def gear(cx, cy, r_out, r_in, teeth=8):
    pts = []
    step = 360 / teeth
    for i in range(teeth):
        a0 = i * step
        for da, r in ((-step * 0.22, r_in), (-step * 0.12, r_out), (step * 0.12, r_out), (step * 0.22, r_in)):
            a = math.radians(a0 + da)
            pts.append(f"{f(cx + r * math.cos(a))},{f(cy + r * math.sin(a))}")
    return "M" + " L".join(pts) + "Z"

def arrow(x1, y1, x2, y2, head=5):
    ang = math.atan2(y2 - y1, x2 - x1)
    l = (x2 - head * math.cos(ang - 0.6), y2 - head * math.sin(ang - 0.6))
    r = (x2 - head * math.cos(ang + 0.6), y2 - head * math.sin(ang + 0.6))
    return (f"M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}"
            f"M{f(l[0])} {f(l[1])}L{f(x2)} {f(y2)}L{f(r[0])} {f(r[1])}")

def scare_glyph():
    d = ""
    for deg in (45, 135, 225, 315):
        a = math.radians(deg)
        d += arrow(24 + 5 * math.cos(a), 24 + 5 * math.sin(a), 24 + 14 * math.cos(a), 24 + 14 * math.sin(a), 5)
    return f'<path d="{d}"/><circle class="s" cx="24" cy="24" r="2.6"/>'

def web_glyph():
    d = ""
    for i in range(6):
        a = math.radians(i * 60 - 90)
        d += f"M24 24L{f(24 + 15 * math.cos(a))} {f(24 + 15 * math.sin(a))}"
    for r in (6, 11):
        pts = [(24 + r * math.cos(math.radians(i * 60 - 90)), 24 + r * math.sin(math.radians(i * 60 - 90))) for i in range(7)]
        d += "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts)
    return f'<path d="{d}" stroke-width="2.4"/>'

def snowflake():
    d = ""
    for deg in (90, 30, -30):
        a = math.radians(deg)
        dx, dy = 14 * math.cos(a), 14 * math.sin(a)
        d += f"M{f(24 - dx)} {f(24 - dy)}L{f(24 + dx)} {f(24 + dy)}"
        for s in (1, -1):
            ex, ey = 24 + s * dx * 0.62, 24 + s * dy * 0.62
            for side in (1, -1):
                b = a + side * math.radians(40) + (0 if s == 1 else math.pi)
                d += f"M{f(ex)} {f(ey)}L{f(ex + 5 * math.cos(b))} {f(ey + 5 * math.sin(b))}"
    return f'<path d="{d}"/>'

def stun_glyph():
    s = ""
    s += '<ellipse cx="24" cy="27" rx="14" ry="5.5" stroke-width="2.4"/>'
    for cx, cy, r in ((12, 25, 5), (24, 15, 6.5), (36, 25, 5)):
        s += f'<path class="s" d="{star(cx, cy, r, r * 0.45)}"/>'
    return s

GLYPHS = {
    # ---- status tokens -------------------------------------------------
    "knocked-over": ("token", "down",
        '<circle class="s" cx="12.5" cy="27.5" r="4"/>'
        '<path d="M17.5 29H37M37 29l1.5-4M23 29l4-5" stroke-width="3.4"/>'
        '<path d="M9 35h30"/>'
        '<path d="M10 17l3 3.5M16 14v4.5M22 17l-3 3.5" stroke-width="2.2"/>'),
    "unconscious": ("token", "out",
        '<path d="M13 19h10l-10 12h10M27 14h7l-7 8h7"/>'),
    "stunned": ("token", "stun", stun_glyph()),
    "webbed": ("token", "web", web_glyph()),
    "frozen": ("token", "ice", snowflake()),
    "scared": ("token", "scare", scare_glyph()),
    "shield": ("token", "shield",
        '<path d="M24 10l12 4.5v8.5c0 8-5.5 12.5-12 15.5-6.5-3-12-7.5-12-15.5v-8.5z"/>'
        '<path d="M19 24l4 4 7-8"/>'),
    "damage": ("token", "damage",
        '<path class="s" d="M24 10c5 7 9.5 11 9.5 17a9.5 9.5 0 0 1-19 0c0-6 4.5-10 9.5-17z"/>'),
    "special": ("token", "special",
        '<path class="s" d="M21.5 11h5l-1 17h-3z"/><circle class="s" cx="24" cy="34" r="3"/>'),
    "warden": ("token", "warden",
        '<circle cx="24" cy="24" r="16" stroke-width="2" stroke-dasharray="3 3.2"/>'
        '<path d="M24 15l7 2.6v5c0 4.7-3.2 7.4-7 9.2-3.8-1.8-7-4.5-7-9.2v-5z"/>'),
    # ---- dice faces ------------------------------------------------------
    "die-pickaxe": ("die", "pick",
        '<path d="M12 20Q24 9 36 20" stroke-width="3.6"/><path d="M24 15L24 38" stroke-width="3.6"/>'),
    "die-bullet": ("die", "bullet",
        '<path class="s" d="M19.5 37V21Q24 9 28.5 21V37z"/><path d="M17 37h14" stroke-width="3"/>'),
    "die-armor-piercing": ("die", "ap",
        '<path d="M31 12v24" stroke-width="4"/>' f'<path d="{arrow(9, 24, 38, 24, 7)}"/>'),
    "die-flame": ("die", "flame",
        '<path class="s" d="M24 9c2 6 9.5 9 9.5 17.5a9.5 9.5 0 0 1-19 0c0-5 3-7.5 4-11.5 2 3 3.5 4.5 5.5 5.5 0-4-1.2-7.5 0-11.5z"/>'),
    "die-explosion": ("die", "explosion",
        f'<path class="s" d="{star(24, 24, 15, 7.5, 9, -90)}"/>'),
    "die-scare": ("die", "scaredie", scare_glyph()),
    # ---- actions -------------------------------------------------------
    "act-move": ("action", None,
        '<path d="M9 33C14 20 27 17 36 23"/>'
        f'<path d="{arrow(30.5, 19.6, 37, 24, 6)}"/>'
        '<circle class="s" cx="9" cy="35" r="2.6"/>'),
    "act-attack": ("action", None,
        '<circle cx="24" cy="24" r="11"/><path d="M24 8v8M24 32v8M8 24h8M32 24h8"/><circle class="s" cx="24" cy="24" r="2.4"/>'),
    "act-pickaxe": ("action", None,
        '<path d="M11 20Q24 8 37 20"/><path d="M24 14V40"/>'),
    "act-throw": ("action", None,
        '<path d="M9 36Q20 6 34 26" stroke-dasharray="3.5 3.5"/><circle class="s" cx="35.5" cy="31" r="4.5"/><path d="M35.5 26.5l2-3"/>'),
    "act-overclock": ("action", None,
        f'<path d="{gear(24, 24, 16, 12.5, 8)}" stroke-width="2.4"/>'
        '<path class="s" d="M26 14l-7 11h5l-2 9 7-11h-5z"/>'),
    "act-resupply": ("action", None,
        '<path d="M15 31v-6a9 9 0 0 1 18 0v6z"/><circle cx="24" cy="25" r="2.8" stroke-width="2.2"/>'
        '<path d="M15 31l-3.5 6M33 31l3.5 6M9.5 37h5M33.5 37h5"/>'
        '<path d="M19 6v5M24 4v6M29 6v5" stroke-width="2.4"/>'),
    "act-collect": ("action", None,
        '<path d="M12 24h24v13H12z"/><path d="M12 24l4-5h16l4 5"/>'
        f'<path d="{arrow(24, 33, 24, 7, 6)}"/>'),
    "act-exchange": ("action", None,
        f'<path d="{arrow(11, 18, 37, 18, 6)}"/><path d="{arrow(37, 30, 11, 30, 6)}"/>'),
    "act-revive": ("action", None,
        '<circle cx="24" cy="24" r="14"/><path d="M24 16v16M16 24h16" stroke-width="4"/>'),
    "act-drill": ("action", None,
        '<path d="M7 19h10v10H7z"/><path d="M17 17L41 24L17 31z"/><path d="M22 18.5l3 11M27.5 20l2.4 8M33 21.6l1.4 4.8" stroke-width="2"/>'),
}

def svg(kind, tone, glyph):
    bg = ""
    if kind == "token":
        bg = f'<circle class="fmi-bg fmi-{tone}" cx="24" cy="24" r="22.5"/><circle class="fmi-ring" cx="24" cy="24" r="19.5"/>'
    elif kind == "die":
        bg = f'<rect class="fmi-bg fmi-{tone}" x="2.5" y="2.5" width="43" height="43" rx="9"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="fmi fmi--{kind}">'
            f'{bg}<g class="fmi-g">{glyph}</g></svg>')

icons = {name: svg(kind, tone, g) for name, (kind, tone, g) in GLYPHS.items()}

ts = ["// GENERATED by tools/gen-icons.py – original Mission Control icon set.",
      "// Edit the generator, not this file. Colours come from CSS (see _field-manual.scss).",
      "export const FM_ICONS: Record<string, string> = {"]
for k, v in icons.items():
    ts.append(f"  '{k}': {json.dumps(v)},")
ts.append("};")
ts.append("")
open(f"{ROOT}/src/app/core/ui/fm-icons.data.ts", "w").write("\n".join(ts))

if not PREVIEW:
    print(len(icons), "icons")
    sys.exit(0)

css = ""  # compile src/styles/_tokens.scss + _fm-icons.scss with sass and paste here for a coloured preview
tiles = "".join(f'<figure>{v}<figcaption>{k}</figcaption></figure>' for k, v in icons.items())
html = f"""<!doctype html><html><head><style>
:root{{--ink:#24211c;--paper:#e7dcc1;--amber-deep:#9c4f00}}
body{{background:#e7dcc1;font:14px sans-serif;color:#24211c;margin:16px}}
.grid{{display:grid;grid-template-columns:repeat(8,110px);gap:10px}}
figure{{margin:0;text-align:center}} svg{{width:64px;height:64px;color:var(--amber-deep)}}
.small svg{{width:28px;height:28px}}
{css}
</style></head><body><div class="grid">{tiles}</div><div class="grid small">{tiles}</div></body></html>"""
open(PREVIEW, "w").write(html)
print(len(icons), "icons")
