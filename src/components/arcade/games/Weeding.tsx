"use client";
import { useEffect, useRef, useState } from "react";
import { Flower2, Sprout } from "lucide-react";
import type { GameProps } from "./types";
import styles from "../Lounge.module.scss";
type Patch = { id: number; flower: boolean; picked: boolean };
const makePatch = (id: number): Patch => ({
  id,
  flower: Math.random() < 0.22,
  picked: false,
});
export default function Weeding({ award }: GameProps) {
  const [patches, setPatches] = useState<Patch[]>(() =>
      Array.from({ length: 12 }, (_, i) => makePatch(i)),
    ),
    picked = useRef(new Set<number>());
  useEffect(() => {
    const timer = setInterval(() => {
      picked.current.clear();
      setPatches((old) => old.map((_, i) => makePatch(i)));
    }, 2100);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className={styles.garden}>
      <p className={styles.playHint}>풀은 쏙쏙! 꽃은 그대로 두어요 ✿</p>
      <div className={styles.gardenGrid}>
        {patches.map((p) => (
          <button
            key={p.id}
            aria-label={`${p.flower ? "꽃" : "풀"} ${p.id + 1}`}
            disabled={p.picked}
            onClick={() => {
              if (picked.current.has(p.id)) return;
              picked.current.add(p.id);
              award(p.flower ? -5 : 10);
              setPatches((old) =>
                old.map((item) =>
                  item.id === p.id ? { ...item, picked: true } : item,
                ),
              );
            }}
            className={p.picked ? styles.picked : ""}
          >
            <span>
              {p.picked
                ? p.flower
                  ? "앗, 꽃이야!"
                  : "+10"
                : p.flower
                  ? <Flower2 size={42} strokeWidth={1.7} color="#c08e9d" fill="#f6dce4"/>
                  : <Sprout size={42} strokeWidth={1.7} color="#7d955d" fill="#dce9c5"/>}
            </span>
            <i />
          </button>
        ))}
      </div>
      <span className={styles.landscape}>
        ✿ &nbsp; 작은 꽃밭에 오신 걸 환영해요 &nbsp; ✿
      </span>
    </div>
  );
}
