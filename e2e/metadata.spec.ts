import { test, expect } from "@playwright/test";

for (const [path, title] of [
  ["/", "몽글몽글 놀이터"],
  ["/photo/", "캐릭터 기념사진"],
  ["/play/memory/", "꿈속 짝 맞추기"],
]) {
  test(`share metadata is present in static HTML: ${path}`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(`<title>${title}`);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
    expect(ogUrl).toBeTruthy();
    const url = new URL(ogUrl!);
    expect(url.pathname).toBe(path);
    expect(url.hostname).not.toBe("localhost");
    expect(html).toContain(`rel="canonical" href="${ogUrl}"`);
    for (const property of ["og:image", "twitter:image"]) {
      const imageUrl = html.match(new RegExp(`(?:property|name)="${property}" content="([^"]+)"`))?.[1];
      expect(imageUrl).toBeTruthy();
      const imagePath = new URL(imageUrl!);
      expect(imagePath.origin).toBe(url.origin);
      const image = await request.get(imagePath.pathname);
      expect(image.ok()).toBe(true);
      expect(image.headers()["content-type"]).toContain("image/png");
    }
  });
}
