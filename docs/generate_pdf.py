import os
from markdown_it import MarkdownIt
from playwright.sync_api import sync_playwright

md_path = r"f:\Projects\MatrikulasiPemrograman26\docs\TOR_Matrikulasi_Pemrograman_TRPL_2026.md"
html_path = r"f:\Projects\MatrikulasiPemrograman26\docs\TOR_Matrikulasi_Pemrograman_TRPL_2026.html"
pdf_path = r"f:\Projects\MatrikulasiPemrograman26\docs\TOR_Matrikulasi_Pemrograman_TRPL_2026.pdf"

with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

md = MarkdownIt("commonmark").enable("table")
rendered_body = md.render(md_content)

html_template = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Terms of Reference (TOR) - Matrikulasi Pemrograman TRPL 2026</title>
<style>
  @page {{
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
    @bottom-right {{
      content: counter(page);
      font-size: 9pt;
      font-family: 'Inter', sans-serif;
      color: #64748B;
    }}
  }}
  
  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.6;
    color: #1E293B;
    background: #FFFFFF;
    margin: 0;
    padding: 0;
  }}

  h1 {{
    font-size: 16pt;
    font-weight: 800;
    text-align: center;
    color: #0F172A;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}

  h2 {{
    font-size: 12.5pt;
    font-weight: 700;
    text-align: center;
    color: #EA580C;
    margin: 0 0 2px 0;
    text-transform: uppercase;
  }}

  h3 {{
    font-size: 11pt;
    font-weight: 700;
    color: #0F172A;
    margin-top: 18px;
    margin-bottom: 8px;
    border-bottom: 1.5px solid #CBD5E1;
    padding-bottom: 4px;
    page-break-after: avoid;
  }}

  h4 {{
    font-size: 10pt;
    font-weight: 700;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }}

  p, li {{
    text-align: justify;
    margin-bottom: 6px;
  }}

  ul, ol {{
    margin-top: 4px;
    margin-bottom: 8px;
    padding-left: 22px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }}

  th, td {{
    border: 1px solid #94A3B8;
    padding: 6px 8px;
    vertical-align: top;
  }}

  th {{
    background-color: #F1F5F9;
    color: #0F172A;
    font-weight: 700;
    text-align: center;
  }}

  pre {{
    background-color: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 8px 12px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
    overflow-x: auto;
    margin: 10px 0;
    page-break-inside: avoid;
  }}

  code {{
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    background-color: #F1F5F9;
    padding: 1px 4px;
    border-radius: 4px;
    color: #C2410C;
  }}

  hr {{
    border: none;
    border-top: 1px solid #E2E8F0;
    margin: 14px 0;
  }}

  strong {{
    color: #0F172A;
  }}

  .header-box {{
    text-align: center;
    border-bottom: 3px double #0F172A;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }}

  .inst-name {{
    font-size: 9.5pt;
    font-weight: 600;
    color: #475569;
    margin: 0;
  }}
</style>
</head>
<body>
<div class="header-box">
  <p class="inst-name">PROGRAM STUDI SARJANA TERAPAN TEKNOLOGI REKAYASA PERANGKAT LUNAK (TRPL)</p>
  <p class="inst-name">PANITIA MATRIKULASI MAHASISWA BARU ANGKATAN 2026</p>
</div>
{rendered_body}
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_template)

print("HTML generated successfully. Generating PDF via Playwright...")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(f"file:///{html_path.replace(os.sep, '/')}")
    page.pdf(
        path=pdf_path,
        format="A4",
        print_background=True,
        margin={
            "top": "15mm",
            "bottom": "15mm",
            "left": "15mm",
            "right": "15mm"
        }
    )
    browser.close()

print(f"PDF generated successfully at: {pdf_path}")
