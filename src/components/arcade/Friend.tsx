import type { Friend as FriendType } from "@/lib/arcade/catalog";

const imageByKind: Record<FriendType, string> = {
  dasoni: "/characters/dasoni.webp",
  pusil: "/characters/pusil.webp",
  bao: "/characters/bao.webp",
  nani: "/characters/nani.webp",
};
const nameByKind: Record<FriendType, string> = {
  dasoni: "다소니", bao: "바오", nani: "나니", pusil: "푸실",
};

/** Uses an individual transparent character asset while preserving the SVG API. */
export default function Friend({
  kind = "dasoni",
  className,
  size,
}: {
  kind?: FriendType;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size ? size * 1.05 : undefined}
      viewBox="0 0 200 210"
      role="img"
      aria-label={nameByKind[kind]}
      style={{ display: "block" }}
    >
      <image
        href={imageByKind[kind]}
        x="0"
        y="0"
        width="200"
        height="210"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
