const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#050505"/>
  <text
    x="256"
    y="292"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="290"
    fill="#D4AF37"
    text-anchor="middle"
    dominant-baseline="middle"
  >S</text>
  <text
    x="256"
    y="392"
    font-family="Arial, sans-serif"
    font-weight="700"
    font-size="88"
    fill="#D4AF37"
    text-anchor="middle"
    dominant-baseline="middle"
  >₹</text>
</svg>`;

const svgBuffer = Buffer.from(faviconSvg);

async function render(size, output) {
  await sharp(svgBuffer).resize(size, size).png().toFile(output);
  console.log(`Created ${output} (${size}x${size})`);
}

async function main() {
  await render(512, path.join(publicDir, "shrix-favicon.png"));
  await render(32, path.join(publicDir, "favicon-32x32.png"));
  await render(16, path.join(publicDir, "favicon-16x16.png"));
  await render(180, path.join(publicDir, "apple-touch-icon.png"));
  await sharp(path.join(publicDir, "favicon-32x32.png")).toFile(
    path.join(publicDir, "favicon.ico")
  );
  console.log("Created favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
