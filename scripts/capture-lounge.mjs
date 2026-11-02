import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const base = process.env.LOUNGE_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    }),
    errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({
    path: "artifacts/lounge-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.screenshot({ path: "artifacts/lounge-kiosk.png", fullPage: true });
  const overflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth > innerWidth,
    vertical: document.documentElement.scrollHeight > innerHeight,
  }));
  for (const id of ["weeding", "snacks", "training", "memory"]) {
    await page.goto(`${base}/play/${id}`);
    await page.getByRole("button", { name: "놀이 시작하기" }).click();
    await page.waitForTimeout(id === "snacks" ? 2000 : 150);
    await page.screenshot({ path: `artifacts/lounge-${id}.png` });
  }
  await page.goto(`${base}/photo`);
  await page.getByRole("button", { name: "이 포즈로 찰칵!" }).click();
  await page
    .getByRole("heading", { name: "귀여운 순간을 담았어요!" })
    .waitFor();
  await page.screenshot({ path: "artifacts/lounge-photo.png" });
  console.log(JSON.stringify({ errors, kioskOverflow: overflow }));
} finally {
  await browser.close();
}
