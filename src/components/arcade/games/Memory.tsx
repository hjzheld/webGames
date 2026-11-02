"use client";
import { useEffect, useRef, useState } from "react";
import { Flower2, Cherry, Heart, Sparkles } from "lucide-react";
import { shuffledPairs } from "@/lib/arcade/memory";
import Friend from "../Friend";
import type { GameProps } from "./types";
import styles from "../Lounge.module.scss";
const symbols = ["dasoni", "bao", "nani", "🌼", "🍓", "⭐"] as const;
export default function Memory({ award, finish }: GameProps) {
  const [cards] = useState(() => shuffledPairs()),
    [open, setOpen] = useState<number[]>([]),
    [matched, setMatched] = useState<number[]>([]),
    locked = useRef(false),
    selection = useRef<number[]>([]),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function flip(id: number) {
    if (
      locked.current ||
      selection.current.includes(id) ||
      matched.includes(id)
    )
      return;
    const next = [...selection.current, id];
    selection.current = next;
    setOpen(next);
    if (next.length !== 2) return;
    locked.current = true;
    const same =
      cards.find((c) => c.id === next[0])!.pair ===
      cards.find((c) => c.id === id)!.pair;
    if (same) award(20);
    timer.current = setTimeout(
      () => {
        if (same) {
          const pairs = [...matched, ...next];
          setMatched(pairs);
          if (pairs.length === 12) finish();
        }
        selection.current = [];
        setOpen([]);
        locked.current = false;
      },
      same ? 350 : 850,
    );
  }
  return (
    <div className={styles.memory}>
      <p className={styles.playHint}>
        같은 그림을 찾아요 <b>{matched.length / 2} / 6 쌍</b>
      </p>
      <div className={styles.memoryGrid}>
        {cards.map((card) => {
          const visible = open.includes(card.id) || matched.includes(card.id),
            symbol = symbols[card.pair];
          return (
            <button
              key={card.id}
              className={`${styles.memoryCard} ${visible ? styles.revealed : ""} ${matched.includes(card.id) ? styles.matched : ""}`}
              aria-label={
                visible ? `그림 ${card.pair + 1}` : `카드 ${card.id + 1}`
              }
              disabled={matched.includes(card.id)}
              onClick={() => flip(card.id)}
            >
              {visible ? (
                card.pair < 3 ? (
                  <Friend
                    kind={symbol as "dasoni" | "bao" | "nani" | "pusil"}
                  />
                ) : (
                  <span>{card.pair === 3 ? <Flower2 size={36} color="#bf8fa0"/> : card.pair === 4 ? <Cherry size={36} color="#be8589"/> : <Heart size={36} color="#be8589"/>}</span>
                )
              ) : (
                <>
                  <span><Sparkles size={30} strokeWidth={1.4}/></span>
                  <small>little dream</small>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
