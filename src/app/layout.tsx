import type { Metadata } from "next";
import { siteUrl } from "@/lib/metadata";
import "@fontsource/gowun-dodum/400.css";
import "@fontsource/jua/400.css";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "몽글몽글 놀이터 — 작은 친구들의 플레이 라운지",
  description:
    "다소니, 바오, 나니, 푸실과 함께 즐기는 팝업스토어 대기 키오스크 게임 라운지.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "몽글몽글 놀이터",
    title: "몽글몽글 놀이터",
    description: "기다리는 시간도, 몽글몽글 즐겁게. 네 친구와 작은 놀이를 즐겨요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "몽글몽글 놀이터",
    description: "기다리는 시간도, 몽글몽글 즐겁게.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
