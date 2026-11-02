"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { GameDefinition } from "@/lib/arcade/catalog";
import { useArcadeRound } from "@/hooks/useArcadeRound";
import Friend from "./Friend";
import Weeding from "./games/Weeding";
import Snacks from "./games/Snacks";
import Training from "./games/Training";
import Memory from "./games/Memory";
import styles from "./Lounge.module.scss";
const components = {
  weeding: Weeding,
  snacks: Snacks,
  training: Training,
  memory: Memory,
};
export default function GameScreen({ game }: { game: GameDefinition }) {
  const round = useArcadeRound(game.duration),
    [returnIn, setReturnIn] = useState(45);
  useEffect(() => {
    if (round.phase === "playing") return;
    setReturnIn(45);
    const deadline = Date.now() + 45000;
    const timer = setInterval(() => {
      const n = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setReturnIn(n);
      // A full navigation clears the previous visitor's entire in-memory session.
      if (!n) window.location.replace("/");
    }, 250);
    return () => clearInterval(timer);
  }, [round.phase]);
  const Game = components[game.id];
  return (
    <main
      className={`${styles.lounge} ${styles.gamePage} ${styles.scrapbookPage} ${game.id === "training" ? styles.trainingPage : ""}`}
      style={
        {
          "--card-color": game.color,
          "--accent": game.accent,
        } as React.CSSProperties
      }
    >
      <header className={styles.topbar}>
        <Link href="/" className={styles.back}>
          ← 놀이 고르기
        </Link>
        <span className={styles.wordmark}>
          몽글몽글 <span>PLAY {game.number}</span>
        </span>
        <span className={styles.pill}>몽글몽글 플레이</span>
      </header>
      <section className={styles.binderCover} aria-label="게임 소개와 규칙">
        <div className={styles.binderSpread}>
          <div className={styles.binderTitle}>
            <span className={styles.paperLabel}>PLAY {game.number}</span>
            <h1>{game.title}</h1>
            <p>{game.description}</p>
          </div>
          <div className={styles.binderRings} aria-hidden="true">
            <i />
            <i />
          </div>
          <div className={styles.binderRules}>
            <h2>이렇게 놀아요</h2>
            <p>{game.rule}</p>
            <span>{game.duration}초 동안 즐기는 작은 놀이</span>
          </div>
        </div>
        <span className={styles.binderBow} aria-hidden="true">
          ୨୧
        </span>
      </section>
      <section className={styles.gameCabinet} aria-label={game.title}>
        <div className={styles.scorebar}>
          <div>
            <small>MY SCORE</small>
            <strong data-testid="score">
              {round.score.toString().padStart(3, "0")}
            </strong>
          </div>
          <span>오늘의 놀이 기록</span>
          <div>
            <small>TIME LEFT</small>
            <strong data-testid="timer">
              00:{String(round.time).padStart(2, "0")}
            </strong>
          </div>
        </div>
        <div className={styles.progress}>
          <i style={{ width: `${(round.time / game.duration) * 100}%` }} />
        </div>
        <div className={styles.playfield}>
          {round.phase === "playing" ? (
            <Game key={round.round} award={round.award} finish={round.finish} />
          ) : (
            <div className={`${styles.roundOverlay} ${styles.scrapbookRound}`}>
              <Friend kind={game.friend} />
              <h2>
                {round.phase === "ready"
                  ? "준비됐나요?"
                  : "오늘도 정말 잘했어!"}
              </h2>
              {round.phase === "result" && (
                <strong className={styles.resultScore}>
                  {round.score}
                  <small> POINTS</small>
                </strong>
              )}
              <button className={styles.primary} onClick={round.start}>
                {round.phase === "ready" ? "놀이 시작하기" : "한 번 더 놀기"} ↗
              </button>
              <Link href="/">다른 놀이 고르기</Link>
              <small className={styles.returnNote}>
                {returnIn}초 후 메인으로 돌아가요
              </small>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
