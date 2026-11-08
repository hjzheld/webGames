import type { Metadata } from "next";

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL ||
    "https://mongle-play-lounge.pages.dev",
);

if (!["http:", "https:"].includes(siteUrl.protocol)) {
  throw new Error("Site URL must use HTTP or HTTPS.");
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: "몽글몽글 놀이터",
      title,
      description,
      url: path,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "몽글몽글 놀이터 — 네 친구와 함께하는 작은 놀이 시간" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/twitter-image.png", alt: "몽글몽글 놀이터 — 네 친구와 함께하는 작은 놀이 시간" }],
    },
  };
}
