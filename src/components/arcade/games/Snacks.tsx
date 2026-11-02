"use client";
import { useEffect, useRef } from "react";
import {
  Apple,
  Cherry,
  Cookie,
  Candy,
  Mountain,
  ShoppingBasket,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Friend from "../Friend";
import type { GameProps } from "./types";
import {
  catchesSnack,
  clampBasketPosition,
  type SnackBounds,
} from "./snackPhysics";
import styles from "../Lounge.module.scss";
type Drop = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  bad: boolean;
};
export default function Snacks({ award }: GameProps) {
  const board = useRef<HTMLDivElement>(null),
    basket = useRef<HTMLDivElement>(null),
    items = useRef<HTMLDivElement>(null),
    icons = useRef<HTMLDivElement>(null),
    x = useRef(50),
    direction = useRef(0);
  useEffect(() => {
    const field = board.current;
    const catcher = basket.current;
    if (!field || !catcher) return;

    let bounds: SnackBounds;
    const measure = () => {
      bounds = {
        width: Math.max(1, field.clientWidth),
        height: field.clientHeight,
        basketTop: catcher.offsetTop,
        basketWidth: catcher.offsetWidth,
        basketHeight: catcher.offsetHeight,
      };
      x.current = clampBasketPosition(x.current, bounds);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(field);
    resize.observe(catcher);

    let frame = 0,
      last = performance.now(),
      spawn = 0,
      nextId = 0,
      lastBasketX = Number.NaN;
    let drops: Drop[] = [];
    const nodes = new Map<number, HTMLSpanElement>();
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      spawn += delta;
      x.current = clampBasketPosition(
        x.current + direction.current * delta * 65,
        bounds,
      );
      if (lastBasketX !== x.current) {
        catcher.style.left = `${x.current}%`;
        lastBasketX = x.current;
      }
      if (spawn > 0.65) {
        spawn = 0;
        const bad = Math.random() < 0.2,
          id = nextId++;
        const node = document.createElement("span");
        const icon = icons.current?.children[bad ? 4 : id % 4];
        if (icon) node.appendChild(icon.cloneNode(true));
        node.dataset.bad = String(bad);
        node.className = styles.fallingSnack;
        nodes.set(id, node);
        items.current?.appendChild(node);
        const drop = {
          id,
          x: 8 + Math.random() * 84,
          y: -6,
          width: node.offsetWidth,
          height: node.offsetHeight,
          bad,
        };
        node.style.left = `${drop.x}%`;
        node.style.top = "0";
        drops.push(drop);
      }
      drops = drops.filter((drop) => {
        const previousY = drop.y;
        drop.y += delta * 24;
        const caught = catchesSnack(drop, previousY, x.current, bounds);
        if (caught) award(drop.bad ? -5 : 10);
        if (caught || drop.y > 103) {
          nodes.get(drop.id)?.remove();
          nodes.delete(drop.id);
          return false;
        }
        const node = nodes.get(drop.id);
        if (node) {
          node.style.transform = `translate(-50%, -50%) translate3d(0, ${(drop.y / 100) * bounds.height}px, 0)`;
        }
        return true;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const heldKeys = new Set<string>();
    const updateDirection = () => {
      direction.current =
        Number(heldKeys.has("ArrowRight")) - Number(heldKeys.has("ArrowLeft"));
    };
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        heldKeys.add(e.key);
        updateDirection();
      }
    };
    const up = (e: KeyboardEvent) => {
      heldKeys.delete(e.key);
      updateDirection();
    };
    const stop = () => {
      heldKeys.clear();
      direction.current = 0;
    };
    const visible = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visible);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      stop();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visible);
      nodes.forEach((node) => node.remove());
    };
  }, [award]);
  const move = (clientX: number) => {
    const rect = board.current?.getBoundingClientRect();
    if (rect && rect.width > 0)
      x.current = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100),
      );
  };
  return (
    <div
      ref={board}
      className={styles.snacks}
      onPointerDown={(e) => {
        if (e.button !== 0 || !e.isPrimary) return;
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX);
      }}
    >
      <p className={styles.playHint}>
        터치해서 바구니 이동 · ← → 키도 사용할 수 있어요
      </p>
      <div className={styles.snackHost}>
        <Friend kind="pusil" />
        <span>우라야하!</span>
      </div>
      <div ref={items} className={styles.drops} aria-hidden="true" />
      <div ref={icons} hidden aria-hidden="true">
        <Apple />
        <Cherry />
        <Cookie />
        <Candy />
        <Mountain />
      </div>
      <div
        ref={basket}
        className={styles.basket}
        role="img"
        aria-label="간식 바구니"
      >
        <ShoppingBasket strokeWidth={1.7} />
      </div>
      <div className={styles.snackButtons}>
        <button
          aria-label="바구니 왼쪽"
          onClick={() => {
            x.current = Math.max(0, x.current - 16);
          }}
        >
          <ArrowLeft size={21} />
        </button>
        <span>간식 +10 · 돌멩이 −5</span>
        <button
          aria-label="바구니 오른쪽"
          onClick={() => {
            x.current = Math.min(100, x.current + 16);
          }}
        >
          <ArrowRight size={21} />
        </button>
      </div>
    </div>
  );
}
