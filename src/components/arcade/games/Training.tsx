"use client";
import { useEffect, useRef, useState } from "react";
import { Target } from "lucide-react";
import Friend from "../Friend";
import type { GameProps } from "./types";
import styles from "../Lounge.module.scss";
export default function Training({ award }: GameProps) {
  const [target, setTarget] = useState({ cell: 4, friend: false, id: 0 }),
    [hit, setHit] = useState(false),
    used = useRef(false);
  useEffect(() => {
    const timer = setInterval(() => {
      used.current = false;
      setHit(false);
      setTarget((t) => ({
        cell: Math.floor(Math.random() * 9),
        friend: Math.random() < 0.28,
        id: t.id + 1,
      }));
    }, 950);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className={styles.training}>
      <p className={styles.playHint}>
        분홍 표적은 톡! 파란 친구는 기다려 주세요.
      </p>
      <div className={styles.targetGrid}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={styles.targetHole}>
            {i === target.cell && !hit && (
              <button
                key={target.id}
                aria-label={target.friend ? "친구 쉬게 두기" : "토벌 표적"}
                className={target.friend ? styles.friendTarget : styles.target}
                onClick={() => {
                  if (used.current) return;
                  used.current = true;
                  setHit(true);
                  award(target.friend ? -5 : 10);
                }}
              >
                {target.friend ? <Friend kind="nani" /> : <Target size={56} strokeWidth={1.5} aria-hidden="true"/>}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className={styles.landscape}>작은 용기 하나, 큰 응원 하나 ✦</p>
    </div>
  );
}
