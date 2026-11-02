import { notFound } from "next/navigation";
import { findGame, games } from "@/lib/arcade/catalog";
import GameScreen from "@/components/arcade/GameScreen";
export const dynamicParams = false;
export function generateStaticParams() {
  return games.map((game) => ({ game: game.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: id } = await params;
  const game = findGame(id);
  if (!game) notFound();
  return <GameScreen key={game.id} game={game} />;
}
