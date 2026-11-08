import { notFound } from "next/navigation";
import { findGame, games } from "@/lib/arcade/catalog";
import GameScreen from "@/components/arcade/GameScreen";
import { pageMetadata } from "@/lib/metadata";
export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game: id } = await params;
  const game = findGame(id);
  if (!game) notFound();
  return pageMetadata(`${game.title} | 몽글몽글 놀이터`, game.description, `/play/${game.id}/`);
}
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
