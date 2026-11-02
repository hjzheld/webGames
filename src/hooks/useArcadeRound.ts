"use client";
import { useCallback, useEffect, useRef, useState } from "react";
export type RoundPhase = "ready" | "playing" | "result";
export function useArcadeRound(duration: number) {
  const [phase, setPhase] = useState<RoundPhase>("ready"),
    [time, setTime] = useState(duration),
    [score, setScore] = useState(0),
    [round, setRound] = useState(0);
  const deadline = useRef(0),
    active = useRef(false);
  const finish = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    setPhase("result");
  }, []);
  const award = useCallback((points: number) => {
    if (active.current && performance.now() < deadline.current)
      setScore((s) => Math.max(0, s + points));
  }, []);
  const start = useCallback(() => {
    active.current = true;
    deadline.current = performance.now() + duration * 1000;
    setScore(0);
    setTime(duration);
    setRound((n) => n + 1);
    setPhase("playing");
  }, [duration]);
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline.current - performance.now()) / 1000),
      );
      setTime(remaining);
      if (!remaining) finish();
    };
    const timer = setInterval(tick, 100);
    const visible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [phase, finish]);
  useEffect(
    () => () => {
      active.current = false;
    },
    [],
  );
  return { phase, time, score, round, start, award, finish };
}
