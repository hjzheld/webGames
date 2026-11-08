import PhotoBooth from "@/components/arcade/PhotoBooth";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "캐릭터 기념사진 | 몽글몽글 놀이터",
  "배경과 친구들의 포즈를 골라 나만의 캐릭터 기념사진을 만들고 PNG로 저장해 보세요.",
  "/photo/",
);
export default function Page() {
  return <PhotoBooth />;
}
