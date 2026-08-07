import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Base directories
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(WEB_DIR, "public")
PUBLIC_ICONS_DIR = os.path.join(PUBLIC_DIR, "icons")
APP_DIR = os.path.join(WEB_DIR, "app")

os.makedirs(PUBLIC_ICONS_DIR, exist_ok=True)
os.makedirs(APP_DIR, exist_ok=True)

# Fonts
FONT_SEGOE_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_SEGOE_REG = "C:/Windows/Fonts/segoeui.ttf"
FONT_CONSOLAS_BOLD = "C:/Windows/Fonts/consolab.ttf"
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

# ----------------------------------------------------
# 2. GENERATE OPEN GRAPH IMAGE (2400x1260 -> 1200x630)
# ----------------------------------------------------
def generate_og_image():
    W, H = 2400, 1260
    img = Image.new("RGBA", (W, H), (10, 13, 20, 255))
    draw = ImageDraw.Draw(img)
    
    # Background Cyber Gradients & Radial Glows
    glow1 = create_radial_glow(W, H, 300, 300, 900, (255, 107, 0, 90)) # Orange top-left
    glow2 = create_radial_glow(W, H, 2000, 950, 1000, (0, 229, 255, 70)) # Cyan bottom-right
    glow3 = create_radial_glow(W, H, 1200, 630, 800, (255, 61, 0, 40)) # Center orange soft
    
    img = Image.alpha_composite(img, glow1)
    img = Image.alpha_composite(img, glow2)
    img = Image.alpha_composite(img, glow3)
    draw = ImageDraw.Draw(img)
    
    # Draw subtle cyber grid pattern
    grid_color = (255, 255, 255, 8)
    grid_size = 80
    for x in range(0, W, grid_size):
        draw.line([(x, 0), (x, H)], fill=grid_color, width=2)
    for y in range(0, H, grid_size):
        draw.line([(0, y), (W, y)], fill=grid_color, width=2)
        
    # --- LEFT SIDE CONTENT ---
    x_left = 120
    y_curr = 140
    
    # 1. Top Badge Capsule
    badge_text = "🚀  PLATFORM BELAJAR CODING TRPL 2026"
    font_badge = get_font(FONT_SEGOE_BOLD, 36)
    bbox_b = font_badge.getbbox(badge_text)
    bw = bbox_b[2] - bbox_b[0] + 60
    bh = 70
    
    draw_rounded_rect(draw, [x_left, y_curr, x_left + bw, y_curr + bh], radius=35, fill=(255, 107, 0, 35), outline=(255, 107, 0, 160), width=3)
    draw.text((x_left + 30, y_curr + 15), badge_text, font=font_badge, fill=(255, 170, 100, 255))
    
    y_curr += 120
    
    # 2. Main Title: "Matrikulasi TRPL"
    font_title = get_font(FONT_SEGOE_BOLD, 120)
    draw.text((x_left, y_curr), "Matrikulasi ", font=font_title, fill=(255, 255, 255, 255))
    
    bbox_m = font_title.getbbox("Matrikulasi ")
    x_trpl = x_left + (bbox_m[2] - bbox_m[0])
    draw.text((x_trpl, y_curr), "TRPL", font=font_title, fill=(255, 130, 20, 255))
    
    y_curr += 150
    
    # 3. Subtitle: "Platform Belajar Coding Anti-Boring"
    font_sub = get_font(FONT_SEGOE_BOLD, 54)
    draw.text((x_left, y_curr), "Platform Belajar Coding Anti-Boring", font=font_sub, fill=(226, 232, 240, 255))
    
    y_curr += 90
    
    # 4. Description line
    font_desc = get_font(FONT_SEGOE_REG, 40)
    draw.text((x_left, y_curr), "Interaktif • Gamifikasi EXP • Live Runner • Kuis & Meme", font=font_desc, fill=(148, 163, 184, 255))
    
    y_curr += 140
    
    # 5. Feature Badges Row
    features = [
        ("🐍 Python 3", (40, 180, 100, 40), (74, 222, 128, 255)),
        ("⚡ Live Code Runner", (255, 107, 0, 40), (255, 160, 80, 255)),
        ("🎮 Gamifikasi & Rank", (168, 85, 247, 40), (216, 180, 254, 255)),
        ("🔥 HIMA TRPL", (239, 68, 68, 40), (252, 165, 165, 255)),
    ]
    
    font_feat = get_font(FONT_SEGOE_BOLD, 36)
    fx = x_left
    fy = y_curr
    for ftext, bg_col, txt_col in features:
        fb = font_feat.getbbox(ftext)
        fw = fb[2] - fb[0] + 50
        fh = 66
        draw_rounded_rect(draw, [fx, fy, fx + fw, fy + fh], radius=20, fill=bg_col, outline=txt_col, width=2)
        draw.text((fx + 25, fy + 12), ftext, font=font_feat, fill=txt_col)
        fx += fw + 24
        if fx > 1150:
            fx = x_left
            fy += 90
            
    # --- RIGHT SIDE CONTENT: IDE / CODE CARD ---
    card_x0, card_y0, card_x1, card_y1 = 1260, 160, 2260, 1100
    
    # Card Shadow
    shadow_layer = Image.new("RGBA", (W, H), (0,0,0,0))
    s_draw = ImageDraw.Draw(shadow_layer)
    s_draw.rounded_rectangle([card_x0 + 10, card_y0 + 20, card_x1 + 10, card_y1 + 20], radius=40, fill=(0, 0, 0, 160))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(30))
    img = Image.alpha_composite(img, shadow_layer)
    draw = ImageDraw.Draw(img)
    
    # Card Background
    draw_rounded_rect(draw, [card_x0, card_y0, card_x1, card_y1], radius=40, fill=(18, 24, 38, 240), outline=(255, 255, 255, 30), width=3)
    
    # Window Header Bar
    bar_h = 80
    draw_rounded_rect(draw, [card_x0, card_y0, card_x1, card_y0 + bar_h], radius=40, fill=(28, 36, 56, 255))
    # Cover bottom rounded corners of top bar
    draw.rectangle([card_x0, card_y0 + 40, card_x1, card_y0 + bar_h], fill=(28, 36, 56, 255))
    draw.line([(card_x0, card_y0 + bar_h), (card_x1, card_y0 + bar_h)], fill=(255, 255, 255, 20), width=2)
    
    # Window Dots (Mac style)
    dots = [(card_x0 + 40, (239, 68, 68)), (card_x0 + 75, (245, 158, 11)), (card_x0 + 110, (34, 197, 94))]
    for dx, dcol in dots:
        draw.ellipse([dx - 12, card_y0 + 40 - 12, dx + 12, card_y0 + 40 + 12], fill=dcol)
        
    # Tab title
    font_tab = get_font(FONT_SEGOE_BOLD, 32)
    draw.text((card_x0 + 160, card_y0 + 22), "🐍 main.py — Matrikulasi TRPL", font=font_tab, fill=(148, 163, 184, 255))
    
    # Code snippet inside IDE
    code_lines = [
        [("# --- Modul Pemrograman TRPL ---", (100, 116, 139))],
        [("class ", (244, 63, 94)), ("MahasiswaTRPL", (56, 189, 248)), (":", (255, 255, 255))],
        [("    def ", (244, 63, 94)), ("__init__", (255, 184, 0)), ("(self, nama):", (255, 255, 255))],
        [("        self.", (255, 255, 255)), ("nama", (56, 189, 248)), (" = nama", (255, 255, 255))],
        [("        self.", (255, 255, 255)), ("exp", (56, 189, 248)), (" = ", (255, 255, 255)), ("1000", (74, 222, 128))],
        [("        self.", (255, 255, 255)), ("status", (56, 189, 248)), (" = ", (255, 255, 255)), ('"Jago Coding 🚀"', (251, 146, 60))],
        [(" ", (0,0,0))],
        [("    def ", (244, 63, 94)), ("belajar", (255, 184, 0)), ("(self, modul):", (255, 255, 255))],
        [("        print", (255, 184, 0)), ('("Lulus " + modul + "!")', (251, 146, 60))],
        [(" ", (0,0,0))],
        [("# Jalankan Matrikulasi Sekarang!", (74, 222, 128))],
        [("user ", (56, 189, 248)), ("= ", (255, 255, 255)), ("MahasiswaTRPL", (56, 189, 248)), ('("Mahasiswa Baru")', (251, 146, 60))],
        [("user.", (255, 255, 255)), ("belajar", (255, 184, 0)), ('("Python 101")', (251, 146, 60))]
    ]
    
    font_code_ide = get_font(FONT_CONSOLAS_BOLD, 36)
    cy = card_y0 + bar_h + 40
    for line in code_lines:
        cx = card_x0 + 40
        for token, color in line:
            draw.text((cx, cy), token, font=font_code_ide, fill=color + (255,))
            tb = font_code_ide.getbbox(token)
            cx += (tb[2] - tb[0])
        cy += 50
        
    # Floating EXP Badge on bottom right of code card
    exp_x0, exp_y0 = card_x1 - 320, card_y1 - 100
    draw_rounded_rect(draw, [exp_x0, exp_y0, exp_x0 + 280, exp_y0 + 80], radius=24, fill=(255, 107, 0, 240), outline=(255, 255, 255, 100), width=3)
    font_exp = get_font(FONT_SEGOE_BOLD, 38)
    draw.text((exp_x0 + 30, exp_y0 + 18), "⚡ +500 EXP", font=font_exp, fill=(255, 255, 255, 255))
    
    # Downscale from 2400x1260 to 1200x630 for ultimate anti-aliased quality
    og_res = img.resize((1200, 630), resample=Image.Resampling.LANCZOS)
    return og_res

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
