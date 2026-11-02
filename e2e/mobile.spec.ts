import { test, expect } from "@playwright/test";

for (const width of [320, 390, 480, 768]) {
  test(`mobile layouts fit ${width}px and all arcade games start`, async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "Viewport sizes are covered explicitly here.",
    );
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "/",
      "/play/weeding",
      "/play/snacks",
      "/play/training",
      "/play/memory",
      "/photo",
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      if (route === "/" && width <= 480) {
        const first = await page
          .locator("a[href='/play/weeding/'], a[href='/play/weeding']")
          .boundingBox();
        const second = await page
          .locator("a[href='/play/snacks/'], a[href='/play/snacks']")
          .boundingBox();
        expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
      }
      if (route.startsWith("/play/")) {
        await page.getByRole("button", { name: "놀이 시작하기" }).click();
        await expect(
          page.getByRole("button", { name: "놀이 시작하기" }),
        ).toBeHidden();
        if (route.endsWith("memory")) {
          const cards = page.getByRole("button", { name: /^카드 / });
          const first = await cards.nth(0).boundingBox();
          const fourth = await cards.nth(3).boundingBox();
          expect(fourth!.y).toBeGreaterThan(first!.y);
          expect(Math.abs(first!.x - fourth!.x)).toBeLessThan(2);
        }
      }
    }
    expect(errors).toEqual([]);
  });
}
