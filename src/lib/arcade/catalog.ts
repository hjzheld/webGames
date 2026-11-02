export type GameId = "weeding" | "snacks" | "training" | "memory";
export type Friend = "dasoni" | "bao" | "nani" | "pusil";
export const games = [
  {
    id: "weeding",
    number: "01",
    title: "풀 뽑기 아르바이트",
    subtitle: "다소니와 함께",
    description: "쏙쏙! 풀을 뽑고 꽃밭을 지켜 주세요.",
    rule: "풀은 +10점, 꽃은 −5점! 풀만 골라 터치해 주세요.",
    duration: 25,
    color: "#e5eddb",
    accent: "#60774f",
    friend: "dasoni",
    tag: "콕콕 터치",
  },
  {
    id: "snacks",
    number: "02",
    title: "푸실의 간식 받기",
    subtitle: "하늘에서 간식이 와르르",
    description: "바구니를 움직여 맛있는 간식을 모아요.",
    rule: "바구니를 좌우로 움직여 간식은 받고, 돌멩이는 피해요. 간식 +10점, 돌멩이 −5점!",
    duration: 25,
    color: "#f6eacb",
    accent: "#9c7937",
    friend: "pusil",
    tag: "좌우로 슥슥",
  },
  {
    id: "training",
    number: "03",
    title: "두근두근 토벌 연습",
    subtitle: "오늘도 용기 내 볼까?",
    description: "장난감 표적은 톡! 친구들은 쉬게 해 줘요.",
    rule: "분홍 표적을 터치하면 +10점! 파란 친구를 터치하면 −5점이에요.",
    duration: 25,
    color: "#f2dfe2",
    accent: "#a36777",
    friend: "nani",
    tag: "타이밍에 톡",
  },
  {
    id: "memory",
    number: "04",
    title: "꿈속 짝 맞추기",
    subtitle: "바오의 포근한 꿈",
    description: "뒤집힌 카드 속 같은 친구를 찾아요.",
    rule: "카드 두 장을 뒤집어 같은 그림을 찾아 주세요. 6쌍을 모두 찾으면 성공!",
    duration: 40,
    color: "#dfeaf0",
    accent: "#5a809a",
    friend: "bao",
    tag: "기억력 반짝",
  },
] as const;
export type GameDefinition = (typeof games)[number];
export function findGame(id: string) {
  return games.find((game) => game.id === id);
}
