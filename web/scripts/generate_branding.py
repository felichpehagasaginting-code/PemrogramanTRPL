import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Base directories
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(WEB_DIR, "public")
PUBLIC_ICONS_DIR = os.path.join(PUBLIC_DIR, "icons")
APP_DIR = os.path.join(WEB_DIR, "app")
IMAGES_DIR = os.path.join(PUBLIC_DIR, "images")

os.makedirs(PUBLIC_ICONS_DIR, exist_ok=True)
os.makedirs(APP_DIR, exist_ok=True)

# Fonts
FONT_SEGOE_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_SEGOE_SEMIBOLD = "C:/Windows/Fonts/segoeuisl.ttf"
FONT_SEGOE_REG = "C:/Windows/Fonts/segoeui.ttf"
FONT_CONSOLAS_BOLD = "C:/Windows/Fonts/consolab.ttf"
FONT_CONSOLAS_REG = "C:/Windows/Fonts/consola.ttf"
FONT_ARIAL_BOLD = "C:/Windows/Fonts/arialbd.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def create_radial_glow(width, height, center_x, center_y, radius, color_rgba):
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    r, g, b, max_a = color_rgba
    
    steps = 40
    for i in range(steps, 0, -1):
        cur_r = int(radius * (i / steps))
        alpha = int(max_a * ((1 - i / steps) ** 2))
        glow_draw.ellipse(
            [center_x - cur_r, center_y - cur_r, center_x + cur_r, center_y + cur_r],
            fill=(r, g, b, alpha)
        )
    return glow

# ----------------------------------------------------
# 1. GENERATE BRAND ICON (1024x1024 hi-res base)
# ----------------------------------------------------
def generate_brand_icon():
    S = 1024
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    
    # Outer dark squircle background
    bg_box = [32, 32, S - 32, S - 32]
    bg_mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(bg_mask).rounded_rectangle(bg_box, radius=220, fill=255)
    
    bg = Image.new("RGBA", (S, S), (15, 20, 32, 255))
    
    # Glow effect inside icon
    glow = create_radial_glow(S, S, S // 2, S // 2, 450, (255, 107, 0, 180))
    bg = Image.alpha_composite(bg, glow)
    
    # Gradient badge box in center
    badge_box = [160, 160, S - 160, S - 160] # 704 x 704
    badge = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badge)
    
    # Draw gradient badge using vertical steps
    badge_mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(badge_mask).rounded_rectangle(badge_box, radius=180, fill=255)
    
    gradient_img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient_img)
    for y in range(badge_box[1], badge_box[3]):
        ratio = (y - badge_box[1]) / (badge_box[3] - badge_box[1])
        # From #FF6B00 (255, 107, 0) to #FF3D00 (255, 61, 0)
        r = int(255)
        g = int(120 - 60 * ratio)
        b = int(0)
        g_draw.line([(badge_box[0], y), (badge_box[2], y)], fill=(r, g, b, 255))
        
    badge = Image.composite(gradient_img, badge, badge_mask)
    bg = Image.alpha_composite(bg, badge)
    
    # Inner border outline on badge
    overlay_draw = ImageDraw.Draw(bg)
    overlay_draw.rounded_rectangle(badge_box, radius=180, outline=(255, 255, 255, 60), width=6)
    
    # Draw `< / >` code symbol in center
    font_code = get_font(FONT_ARIAL_BOLD, 280)
    code_text = "</>"
    
    # Measure text
    bbox = font_code.getbbox(code_text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    tx = (S - tw) // 2 - bbox[0]
    ty = (S - th) // 2 - bbox[1] - 40
    
    # Shadow for text
    overlay_draw.text((tx + 4, ty + 6), code_text, font=font_code, fill=(0, 0, 0, 100))
    # Main text
    overlay_draw.text((tx, ty), code_text, font=font_code, fill=(255, 255, 255, 255))
    
    # Bottom text "TRPL"
    font_sub = get_font(FONT_SEGOE_BOLD, 76)
    sub_text = "MATRIKULASI TRPL"
    sbox = font_sub.getbbox(sub_text)
    sw = sbox[2] - sbox[0]
    sx = (S - sw) // 2 - sbox[0]
    sy = ty + th + 65
    
    overlay_draw.text((sx + 2, sy + 3), sub_text, font=font_sub, fill=(0, 0, 0, 120))
    overlay_draw.text((sx, sy), sub_text, font=font_sub, fill=(255, 240, 230, 240))
    
    # Apply background mask for smooth rounded corners
    final_icon = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    final_icon = Image.composite(bg, final_icon, bg_mask)
    return final_icon

def draw_check_icon(draw, cx, cy, size, color):
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(color[0], color[1], color[2], 35), outline=color, width=2)
    scale = size / 26
    p1 = (cx - int(7 * scale), cy)
    p2 = (cx - int(2 * scale), cy + int(5 * scale))
    p3 = (cx + int(7 * scale), cy - int(5 * scale))
    draw.line([p1, p2, p3], fill=color, width=max(2, int(3 * scale)), joint="curve")

def draw_bolt_icon(draw, cx, cy, size, color):
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(color[0], color[1], color[2], 35), outline=color, width=2)
    scale = size / 26
    pts = [
        (cx + int(1 * scale), cy - int(9 * scale)),
        (cx - int(6 * scale), cy + int(1 * scale)),
        (cx - int(1 * scale), cy + int(1 * scale)),
        (cx - int(2 * scale), cy + int(9 * scale)),
        (cx + int(6 * scale), cy - int(1 * scale)),
        (cx + int(1 * scale), cy - int(1 * scale)),
    ]
    draw.polygon(pts, fill=color)

def draw_cert_icon(draw, cx, cy, size, color):
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(color[0], color[1], color[2], 35), outline=color, width=2)
    scale = size / 26
    pts = [
        (cx, cy - int(6 * scale)),
        (cx + int(5 * scale), cy),
        (cx, cy + int(6 * scale)),
        (cx - int(5 * scale), cy)
    ]
    draw.polygon(pts, fill=color)

# ----------------------------------------------------
# 2. GENERATE OPEN GRAPH IMAGE (2400x1260 -> 1200x630)
# ----------------------------------------------------
def generate_og_image():
    W, H = 2400, 1260
    # Clean obsidian-slate base
    img = Image.new("RGBA", (W, H), (9, 13, 22, 255))
    
    # 1. Subtle, Architectural Atmospheric Glows
    glow_indigo = create_radial_glow(W, H, 420, 360, 1100, (124, 58, 237, 40))
    glow_amber = create_radial_glow(W, H, 1900, 680, 1050, (249, 115, 22, 32))
    glow_depth = create_radial_glow(W, H, 1200, 630, 950, (15, 23, 42, 60))
    
    img = Image.alpha_composite(img, glow_indigo)
    img = Image.alpha_composite(img, glow_amber)
    img = Image.alpha_composite(img, glow_depth)
    draw = ImageDraw.Draw(img)
    
    # 2. Sleek Top Border (Vibrant gradient strip)
    for x in range(W):
        ratio = x / W
        r = int(147 + (249 - 147) * ratio)
        g = int(51 + (115 - 51) * ratio)
        b = int(234 + (22 - 234) * ratio)
        draw.line([(x, 0), (x, 6)], fill=(r, g, b, 255), width=1)

    # ----------------------------------------------------
    # LEFT COLUMN: Institutional Branding & Value Proposition
    # ----------------------------------------------------
    x_left = 130
    y_curr = 120
    
    # Institutional Header Pill with Logos
    logo_cwe_path = os.path.join(IMAGES_DIR, "logo_kiri_cwe.png")
    logo_trpl_path = os.path.join(IMAGES_DIR, "logo_kanan_trpl.png")
    
    logo_h = 66
    try:
        im_cwe = Image.open(logo_cwe_path).convert("RGBA")
        im_trpl = Image.open(logo_trpl_path).convert("RGBA")
        
        cwe_w = int(im_cwe.width * (logo_h / im_cwe.height))
        im_cwe_res = im_cwe.resize((cwe_w, logo_h), Image.Resampling.LANCZOS)
        
        trpl_w = int(im_trpl.width * (logo_h / im_trpl.height))
        im_trpl_res = im_trpl.resize((trpl_w, logo_h), Image.Resampling.LANCZOS)
        
        pill_w = cwe_w + trpl_w + 630
        pill_h = logo_h + 24
        draw_rounded_rect(draw, [x_left, y_curr, x_left + pill_w, y_curr + pill_h], radius=pill_h // 2,
                          fill=(15, 23, 42, 220), outline=(255, 255, 255, 22), width=1)
        
        img.paste(im_cwe_res, (x_left + 16, y_curr + 12), im_cwe_res)
        img.paste(im_trpl_res, (x_left + cwe_w + 26, y_curr + 12), im_trpl_res)
        
        font_inst = get_font(FONT_SEGOE_BOLD, 23)
        font_sub_inst = get_font(FONT_SEGOE_REG, 21)
        tx_inst = x_left + cwe_w + trpl_w + 40
        draw.text((tx_inst, y_curr + 15), "POLITEKNIK KELAPA SAWIT CITRA WIDYA EDUKASI", font=font_inst, fill=(248, 250, 252, 245))
        draw.text((tx_inst, y_curr + 44), "Himpunan Mahasiswa D4 Teknologi Rekayasa Perangkat Lunak", font=font_sub_inst, fill=(148, 163, 184, 230))
    except Exception as e:
        print("Logos error:", e)
        
    y_curr += 140
    
    # Official Program Badge Pill
    font_badge = get_font(FONT_SEGOE_BOLD, 27)
    badge_label = "MATRIKULASI PEMROGRAMAN 2026"
    bb = font_badge.getbbox(badge_label)
    bw = (bb[2] - bb[0]) + 68
    bh = 50
    
    draw_rounded_rect(draw, [x_left, y_curr, x_left + bw, y_curr + bh], radius=25,
                      fill=(124, 58, 237, 28), outline=(167, 139, 250, 160), width=2)
    draw.ellipse([x_left + 20, y_curr + 19, x_left + 32, y_curr + 31], fill=(34, 197, 94, 255))
    draw.text((x_left + 44, y_curr + 10), badge_label, font=font_badge, fill=(221, 214, 254, 255))
    
    y_curr += 90
    
    # Main Headline
    font_h1 = get_font(FONT_SEGOE_BOLD, 92)
    draw.text((x_left, y_curr), "Matrikulasi", font=font_h1, fill=(255, 255, 255, 255))
    m_bb = font_h1.getbbox("Matrikulasi ")
    x_trpl = x_left + (m_bb[2] - m_bb[0])
    draw.text((x_trpl, y_curr), "TRPL", font=font_h1, fill=(255, 140, 40, 255))
    
    y_curr += 105
    
    draw.text((x_left, y_curr), "Platform Pemrograman", font=font_h1, fill=(255, 255, 255, 255))
    y_curr += 130
    
    # Subtitle / Value Proposition
    font_tag1 = get_font(FONT_SEGOE_SEMIBOLD, 40)
    draw.text((x_left, y_curr), "Fondasi Koding Nyata Calon Software Engineer.", font=font_tag1, fill=(241, 245, 249, 255))
    y_curr += 58
    
    font_tag2 = get_font(FONT_SEGOE_REG, 33)
    draw.text((x_left, y_curr), "Praktik Python langsung di browser, didukung auto-grader", font=font_tag2, fill=(148, 163, 184, 240))
    y_curr += 44
    draw.text((x_left, y_curr), "instan, 9 modul terstruktur & sertifikat resmi kelulusan.", font=font_tag2, fill=(148, 163, 184, 240))
    y_curr += 85
    
    # Feature Pills
    features_list = [
        ("WebAssembly Python (0ms Latency)", draw_bolt_icon, (168, 85, 247), (124, 58, 237, 24)),
        ("Automated Grader & Real-Time Feedback", draw_check_icon, (74, 222, 128), (34, 197, 94, 24)),
        ("9 Modul Kurikulum & Sertifikat Resmi", draw_cert_icon, (251, 146, 60), (234, 88, 12, 24)),
    ]
    
    font_chip = get_font(FONT_SEGOE_BOLD, 28)
    chip_y = y_curr
    for text, draw_fn, stroke_col, bg_col in features_list:
        c_bb = font_chip.getbbox(text)
        cw = (c_bb[2] - c_bb[0]) + 86
        ch = 56
        draw_rounded_rect(draw, [x_left, chip_y, x_left + cw, chip_y + ch], radius=16,
                          fill=(15, 23, 42, 220), outline=stroke_col, width=2)
        draw_fn(draw, x_left + 30, chip_y + 28, 26, stroke_col)
        draw.text((x_left + 56, chip_y + 11), text, font=font_chip, fill=(241, 245, 249, 255))
        chip_y += 72
        
    # Domain Footer Pill
    font_url = get_font(FONT_SEGOE_BOLD, 26)
    url_text = "pemrograman-trpl.vercel.app"
    u_bb = font_url.getbbox(url_text)
    uw = (u_bb[2] - u_bb[0]) + 48
    uh = 46
    draw_rounded_rect(draw, [x_left, H - 90, x_left + uw, H - 90 + uh], radius=23,
                      fill=(18, 24, 38, 220), outline=(255, 255, 255, 25), width=1)
    draw.text((x_left + 24, H - 82), url_text, font=font_url, fill=(148, 163, 184, 255))

    # ----------------------------------------------------
    # RIGHT COLUMN: Clean Code Editor & Auto-Grader Output
    # ----------------------------------------------------
    card_x0, card_y0 = 1220, 120
    card_x1, card_y1 = 2270, 1140
    
    # 1. Soft Ambient Card Shadow
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    s_draw.rounded_rectangle([card_x0 + 10, card_y0 + 20, card_x1 + 10, card_y1 + 20], radius=36, fill=(0, 0, 0, 200))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(36))
    img = Image.alpha_composite(img, shadow_layer)
    draw = ImageDraw.Draw(img)
    
    # 2. Main IDE Window Card
    draw_rounded_rect(draw, [card_x0, card_y0, card_x1, card_y1], radius=32,
                      fill=(13, 18, 30, 248), outline=(255, 255, 255, 28), width=2)
                      
    # Top Window Chrome Header
    header_h = 74
    draw_rounded_rect(draw, [card_x0, card_y0, card_x1, card_y0 + header_h], radius=32, fill=(20, 27, 45, 255))
    draw.rectangle([card_x0, card_y0 + 32, card_x1, card_y0 + header_h], fill=(20, 27, 45, 255))
    draw.line([(card_x0, card_y0 + header_h), (card_x1, card_y0 + header_h)], fill=(255, 255, 255, 18), width=2)
    
    # Traffic Lights
    dots = [
        (card_x0 + 40, (239, 68, 68, 220)),
        (card_x0 + 70, (245, 158, 11, 220)),
        (card_x0 + 100, (34, 197, 94, 220)),
    ]
    for dx, dcol in dots:
        draw.ellipse([dx - 9, card_y0 + 37 - 9, dx + 9, card_y0 + 37 + 9], fill=dcol)
        
    # Tab Title
    font_tab = get_font(FONT_SEGOE_BOLD, 26)
    draw.text((card_x0 + 135, card_y0 + 22), "modul_05_fungsi.py", font=font_tab, fill=(226, 232, 240, 255))
    
    # Compiler pill
    comp_pill = "Python 3.12 (Pyodide WASM)"
    font_pill = get_font(FONT_SEGOE_BOLD, 23)
    pbb = font_pill.getbbox(comp_pill)
    pw = (pbb[2] - pbb[0]) + 32
    px = card_x1 - pw - 26
    draw_rounded_rect(draw, [px, card_y0 + 18, px + pw, card_y0 + 56], radius=14,
                      fill=(30, 41, 59, 220), outline=(71, 85, 105, 180), width=1)
    draw.text((px + 16, card_y0 + 23), comp_pill, font=font_pill, fill=(148, 163, 184, 255))
    
    # 3. Code Content
    code_tokens = [
        [("# Modul 05: Definisi Fungsi & Evaluasi Logika", (100, 116, 139))],
        [("def ", (192, 132, 252)), ("evaluasi_kelulusan", (56, 189, 248)), ("(mhs: ", (226, 232, 240)), ("dict", (74, 222, 128)), (") -> ", (226, 232, 240)), ("dict", (74, 222, 128)), (":", (226, 232, 240))],
        [("    tugas = mhs.get(", (226, 232, 240)), ('"nilai_tugas"', (251, 146, 60)), (", [])", (226, 232, 240))],
        [("    rata2 = sum(tugas) / len(tugas) ", (226, 232, 240)), ("if ", (192, 132, 252)), ("tugas ", (226, 232, 240)), ("else ", (192, 132, 252)), ("0.0", (251, 146, 60))],
        [("    ", (226, 232, 240))],
        [("    return {", (226, 232, 240))],
        [('        "nim"', (251, 146, 60)), (": mhs[", (226, 232, 240)), ('"nim"', (251, 146, 60)), ( "],", (226, 232, 240))],
        [('        "lulus"', (251, 146, 60)), (": rata2 >= ", (226, 232, 240)), ("75.0", (251, 146, 60)), (",", (226, 232, 240))],
        [('        "grade"', (251, 146, 60)), (': "', (226, 232, 240)), ("A", (74, 222, 128)), ('" if rata2 >= 85 else "', (226, 232, 240)), ("B", (251, 146, 60)), ('",', (226, 232, 240))],
        [('        "status"', (251, 146, 60)), (': "', (226, 232, 240)), ("Kompeten TRPL", (74, 222, 128)), ('"', (226, 232, 240))],
        [("    }", (226, 232, 240))],
    ]
    
    font_code = get_font(FONT_CONSOLAS_BOLD, 30)
    cy = card_y0 + header_h + 32
    line_no = 1
    font_num = get_font(FONT_CONSOLAS_REG, 25)
    
    for line in code_tokens:
        draw.text((card_x0 + 34, cy + 3), f"{line_no:2d}", font=font_num, fill=(71, 85, 105, 200))
        cx = card_x0 + 96
        for text, col in line:
            draw.text((cx, cy), text, font=font_code, fill=col + (255,))
            cx += (font_code.getbbox(text)[2] - font_code.getbbox(text)[0])
        cy += 46
        line_no += 1
        
    # 4. Integrated Auto-Grader / Terminal Results Window
    term_y0 = card_y1 - 330
    draw_rounded_rect(draw, [card_x0, term_y0, card_x1, card_y1], radius=32, fill=(10, 14, 24, 255))
    draw.rectangle([card_x0, term_y0, card_x1, term_y0 + 32], fill=(10, 14, 24, 255))
    draw.line([(card_x0, term_y0), (card_x1, term_y0)], fill=(255, 255, 255, 22), width=2)
    
    # Terminal Header
    font_term_title = get_font(FONT_SEGOE_BOLD, 25)
    draw_bolt_icon(draw, card_x0 + 44, term_y0 + 30, 20, (251, 146, 60))
    draw.text((card_x0 + 64, term_y0 + 17), "AUTO-GRADER & UNIT TEST RUNNER", font=font_term_title, fill=(148, 163, 184, 255))
    
    # Passing Badge
    font_pass = get_font(FONT_SEGOE_BOLD, 23)
    pass_text = "100/100 PASSED"
    p_bb = font_pass.getbbox(pass_text)
    p_w = (p_bb[2] - p_bb[0]) + 52
    p_x = card_x1 - p_w - 30
    draw_rounded_rect(draw, [p_x, term_y0 + 14, p_x + p_w, term_y0 + 50], radius=14,
                      fill=(34, 197, 94, 30), outline=(74, 222, 128, 200), width=1)
    draw_check_icon(draw, p_x + 20, term_y0 + 32, 18, (74, 222, 128))
    draw.text((p_x + 36, term_y0 + 19), pass_text, font=font_pass, fill=(74, 222, 128, 255))
    
    # Test details
    font_term_code = get_font(FONT_CONSOLAS_BOLD, 25)
    test_lines = [
        ("Test 1: Validasi struktur data mahasiswa .... PASSED (0.012s)", (74, 222, 128)),
        ("Test 2: Edge case penanganan list kosong ...... PASSED (0.008s)", (74, 222, 128)),
        ("Test 3: Logika ambang batas predikat kelulusan . PASSED (0.009s)", (74, 222, 128)),
        ("Status: Kode terverifikasi otomatis & memenuhi silabus TRPL.", (148, 163, 184)),
    ]
    
    ty = term_y0 + 72
    for ttext, tcol in test_lines:
        if "PASSED" in ttext:
            draw_check_icon(draw, card_x0 + 44, ty + 15, 18, (74, 222, 128))
        else:
            draw.ellipse([card_x0 + 40, ty + 12, card_x0 + 48, ty + 20], fill=(148, 163, 184))
        draw.text((card_x0 + 64, ty), ttext, font=font_term_code, fill=tcol + (255,))
        ty += 39

    # Supersampled anti-aliased resize to 1200x630
    final_res = img.resize((1200, 630), resample=Image.Resampling.LANCZOS)
    return final_res

# ----------------------------------------------------
# MAIN EXECUTION & FILE SAVING
# ----------------------------------------------------
print("Generating Matrikulasi TRPL Brand Assets...")

# 1. Generate High-Res Icon
brand_icon = generate_brand_icon()

# Resize & save icons
icon_512 = brand_icon.resize((512, 512), resample=Image.Resampling.LANCZOS)
icon_192 = brand_icon.resize((192, 192), resample=Image.Resampling.LANCZOS)
icon_180 = brand_icon.resize((180, 180), resample=Image.Resampling.LANCZOS)

# Save PNGs to public/icons and public/ and app/
icon_512.save(os.path.join(PUBLIC_ICONS_DIR, "icon-512x512.png"))
icon_192.save(os.path.join(PUBLIC_ICONS_DIR, "icon-192x192.png"))
icon_180.save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"))
icon_512.save(os.path.join(PUBLIC_DIR, "icon.png"))

icon_512.save(os.path.join(APP_DIR, "icon.png"))
icon_180.save(os.path.join(APP_DIR, "apple-icon.png"))

# Generate multi-size favicon.ico
icon_16 = brand_icon.resize((16, 16), resample=Image.Resampling.LANCZOS)
icon_32 = brand_icon.resize((32, 32), resample=Image.Resampling.LANCZOS)
icon_48 = brand_icon.resize((48, 48), resample=Image.Resampling.LANCZOS)

icon_48.save(
    os.path.join(PUBLIC_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)
icon_48.save(
    os.path.join(APP_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)
print("Icon assets generated successfully!")

# 2. Generate Open Graph Image
og_img = generate_og_image()
og_img.save(os.path.join(PUBLIC_DIR, "og-image.png"))
og_img.save(os.path.join(APP_DIR, "opengraph-image.png"))
og_img.save(os.path.join(APP_DIR, "twitter-image.png"))
print("Open Graph and Twitter images generated successfully!")
