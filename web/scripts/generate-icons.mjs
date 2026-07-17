import sharp from "sharp";
import { writeFileSync } from "fs";

const sizes = [192, 512];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF6B00"/>
      <stop offset="100%" stop-color="#FF9D00"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#g)"/>
  <text x="256" y="320" text-anchor="middle" font-family="system-ui,sans-serif" font-size="260" font-weight="900" fill="white">&#60;/&#62;</text>
  <text x="256" y="420" text-anchor="middle" font-family="system-ui,sans-serif" font-size="56" font-weight="700" fill="rgba(255,255,255,0.9)">MATRIKULASI</text>
</svg>`;

for (const size of sizes) {
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  writeFileSync(`public/icons/icon-${size}x${size}.png`, buf);
  console.log(`Generated icon-${size}x${size}.png`);
}
