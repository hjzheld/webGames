import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("removed legacy routes are not exposed", async ({ request }) => {
  for (const path of ["/crane", "/admin", "/api/plays/start"]) {
    expect((await request.get(path)).status()).toBe(404);
  }
  expect((await request.post("/api/plays/start", { data: {} })).status()).toBe(404);
});
test("hub opens all four games and the separate photo experience", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "기다리는 시간도",
  );
  const links = page
    .getByRole("region", { name: "게임 선택" })
    .getByRole("link");
  await expect(links).toHaveCount(4);
  for (const id of ["weeding", "snacks", "training", "memory"]) {
    await page.locator(`a[href='/play/${id}']`).click();
    await expect(
      page.getByRole("button", { name: "놀이 시작하기" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "← 놀이 고르기" }).click();
  }
  await page.getByRole("link", { name: /오늘의 순간을 엽서처럼/ }).click();
  await expect(
    page.getByRole("heading", { name: "오늘의 작은 기념사진" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("weeding scores once, ends on time, resets and returns home", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/play/weeding");
  await page.getByRole("button", { name: "놀이 시작하기" }).click();
  const weed = page.getByRole("button", { name: /^풀 / }).first();
  await weed.click();
  await expect(page.getByTestId("score")).toHaveText("010");
  await expect(weed).toBeDisabled();
  await page.clock.fastForward(26000);
  await expect(
    page.getByRole("heading", { name: "오늘도 정말 잘했어!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "한 번 더 놀기" }).click();
  await expect(page.getByTestId("score")).toHaveText("000");
  await expect(page.getByTestId("timer")).toHaveText("00:25");
  await page.clock.fastForward(26000);
  await page.clock.fastForward(46000);
  await expect(page).toHaveURL("/");
});
test("snacks really fall, collide with the basket, and respond to keys", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.5;
  });
  await page.goto("/play/snacks");
  await page.getByRole("button", { name: "놀이 시작하기" }).click();
  await expect(page.getByTestId("score")).not.toHaveText("000", {
    timeout: 12000,
  });
  const basket = page.getByRole("img", { name: "간식 바구니" }),
    before = await basket.getAttribute("style");
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(100);
  await page.keyboard.press("a");
  const withOtherKey = await basket.getAttribute("style");
  await expect(basket).not.toHaveAttribute("style", withOtherKey!);
  await page.keyboard.up("ArrowRight");
  await expect(basket).not.toHaveAttribute("style", before!);
  const stopped = await basket.getAttribute("style");
  await page.waitForTimeout(150);
  await expect(basket).toHaveAttribute("style", stopped!);
  await page.keyboard.down("ArrowLeft");
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(100);
  const bothHeld = await basket.getAttribute("style");
  await page.waitForTimeout(100);
  await expect(basket).toHaveAttribute("style", bothHeld!);
  await page.keyboard.up("ArrowRight");
  await expect(basket).not.toHaveAttribute("style", bothHeld!);
  await page.keyboard.up("ArrowLeft");
  await page.getByRole("link", { name: "← 놀이 고르기" }).click();
  await page.locator("a[href='/play/snacks']").click();
  await expect(page.getByTestId("score")).toHaveText("000");
});
test("training rewards a target and prevents a second hit", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/play/training");
  await page.getByRole("button", { name: "놀이 시작하기" }).click();
  await page.getByRole("button", { name: "토벌 표적" }).click();
  await expect(page.getByTestId("score")).toHaveText("010");
  await expect(page.getByRole("button", { name: "토벌 표적" })).toHaveCount(0);
  await page.clock.fastForward(26000);
  await expect(
    page.getByRole("button", { name: "한 번 더 놀기" }),
  ).toBeVisible();
});
test("memory resolves six pairs and finishes early", async ({ page }) => {
  await page.clock.install();
  await page.goto("/play/memory");
  await page.getByRole("button", { name: "놀이 시작하기" }).click();
  const cards = page
    .getByRole("region", { name: "꿈속 짝 맞추기" })
    .getByRole("button");
  const known = new Map<string, number[]>();
  for (let i = 0; i < 12; i += 2) {
    for (const index of [i, i + 1]) {
      await cards.nth(index).click();
      const label = await cards.nth(index).getAttribute("aria-label");
      const ids = known.get(label!) ?? [];
      ids.push(index);
      known.set(label!, ids);
    }
    await page.clock.fastForward(900);
  }
  for (const ids of known.values()) {
    if (await page.getByRole("button", { name: "한 번 더 놀기" }).isVisible())
      break;
    if (await cards.nth(ids[0]).isDisabled()) continue;
    await cards.nth(ids[0]).click();
    await cards.nth(ids[1]).click();
    await page.clock.fastForward(400);
  }
  await expect(
    page.getByRole("heading", { name: "오늘도 정말 잘했어!" }),
  ).toBeVisible();
  await expect(page.getByTestId("score")).toHaveText("120");
});
test("photo creates a downloadable PNG without camera access", async ({
  page,
}) => {
  await page.goto("/photo");
  await page.getByRole("button", { name: "분홍 꽃밭" }).click();
  await expect(page.getByRole("button", { name: "분홍 꽃밭" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "신나는 인사" }).click();
  await page.getByRole("button", { name: "이 포즈로 찰칵!" }).click();
  await expect(
    page.getByRole("heading", { name: "귀여운 순간을 담았어요!" }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "기념사진 저장하기" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("little-lovely-memory.png");
  const bytes = await readFile((await file.path())!);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(bytes.readUInt32BE(16)).toBeGreaterThanOrEqual(600);
  expect(bytes.readUInt32BE(20)).toBeGreaterThanOrEqual(700);
  // The character area must contain illustration detail, not just the flat
  // background produced when nested SVG images fail to load during export.
  const uniqueColors = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const pixels = ctx.getImageData(460, 860, 200, 100).data;
    const colors = new Set<string>();
    for (let i = 0; i < pixels.length; i += 4)
      colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
    return colors.size;
  }, bytes.toString("base64"));
  expect(uniqueColors).toBeGreaterThan(50);
  await page.getByRole("button", { name: "다른 포즈로 다시 찍기" }).click();
  await expect(
    page.getByRole("button", { name: "이 포즈로 찰칵!" }),
  ).toBeEnabled();
});
