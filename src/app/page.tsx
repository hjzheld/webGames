import GameHub from "@/components/arcade/GameHub";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "몽글몽글 놀이터 — 작은 친구들의 플레이 라운지",
  "기다리는 시간도, 몽글몽글 즐겁게. 네 친구와 미니게임과 캐릭터 기념사진을 즐겨요.",
  "/",
);
export default function Page() {
  return <GameHub />;
}
