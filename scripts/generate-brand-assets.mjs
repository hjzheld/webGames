import { chromium } from "@playwright/test";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const base = process.env.LOUNGE_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.load('400 76px "Jua"', "몽글몽글 놀이터");
    const art = document.createElement("div");
    art.id = "brand-og";
    art.innerHTML = `<div class="frame"></div><div class="brand">MONGLE MONGLE · PLAY LOUNGE</div><div class="copy"><h1>몽글몽글 놀이터</h1><p>기다리는 시간도, 몽글몽글 즐겁게.</p></div><div class="friends">${["dasoni", "bao", "nani", "pusil"].map((name) => `<div class="friend"><img src="/characters/${name}.webp" alt=""/></div>`).join("")}</div><div class="foot">네 친구와 함께하는 작은 놀이 시간</div>`;
    const style = document.createElement("style");
    style.textContent = `#brand-og{position:fixed;inset:0;z-index:2147483647;width:1200px;height:630px;overflow:hidden;box-sizing:border-box;background:#fbf6e9;color:#79695e;text-align:center;font-family:"Gowun Dodum",sans-serif;background-image:radial-gradient(#cbb99b35 .7px,transparent .7px);background-size:7px 7px}#brand-og .frame{position:absolute;inset:24px;border:1px solid #d6aba6;border-radius:14px;box-shadow:inset 0 0 0 7px #fbf6e9,inset 0 0 0 8px #e8d4c5}#brand-og .brand{padding-top:57px;font-size:13px;letter-spacing:5px;color:#a98c80}#brand-og h1{font:400 76px "Jua",sans-serif;letter-spacing:-2px;margin:22px 0 8px;color:#a7777c}#brand-og p{font-size:23px;margin:0;color:#8e8570}#brand-og .friends{display:flex;justify-content:center;gap:20px;margin-top:22px}#brand-og .friend{display:flex;justify-content:center;align-items:center;width:203px;height:226px;border-radius:100px 100px 10px 10px;background:#e8eddc;border:1px solid #ced7ba}#brand-og .friend:nth-child(2){background:#e2ecf0;border-color:#c7d9e1;transform:rotate(-3deg)}#brand-og .friend:nth-child(3){background:#f6e9cb;border-color:#e5d5aa;transform:rotate(3deg)}#brand-og .friend:nth-child(4){background:#f1e2dc;border-color:#dfc7bd}#brand-og img{width:185px;height:215px;object-fit:contain}#brand-og .foot{margin-top:22px;font-size:15px;letter-spacing:2px;color:#9c8a79}`;
    document.head.appendChild(style);
    document.body.appendChild(art);
    await document.fonts.ready;
    await Promise.all(Array.from(art.querySelectorAll("img"), (img) => img.decode()));
  });
  await page.locator("#brand-og").screenshot({ path: "src/app/opengraph-image.png", animations: "disabled" });
} finally {
  await browser.close();
}

await sharp("src/app/opengraph-image.png").png({ compressionLevel: 9 }).toFile("src/app/twitter-image.png");
await sharp("src/app/icon.svg").resize(180, 180).png().toFile("src/app/apple-icon.png");
const png = await sharp("src/app/icon.svg").resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile("src/app/favicon.ico", Buffer.concat([header, png]));
console.log("Created OG (1200×630), Twitter image, SVG/ICO favicon and Apple icon.");
