"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Friend from "./Friend";
import styles from "./Lounge.module.scss";
const backgrounds = [
  { name: "크림 피크닉", sky: "#f4ebd8", ground: "#dce4c8" },
  { name: "분홍 꽃밭", sky: "#f8e4e5", ground: "#e6d5d8" },
  { name: "파란 꿈나라", sky: "#e1edf2", ground: "#c5d7e3" },
];
const poses = ["옹기종기", "신나는 인사", "꾸벅꾸벅"];
export default function PhotoBooth() {
  const [background, setBackground] = useState(0),
    [pose, setPose] = useState(0),
    [count, setCount] = useState<number | null>(null),
    [captured, setCaptured] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const image = useRef<SVGSVGElement>(null),
    timer = useRef<ReturnType<typeof setInterval> | null>(null),
    idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetIdle = useCallback(() => {
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => window.location.replace("/"), 60000);
  }, []);
  useEffect(() => {
    resetIdle();
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (idle.current) clearTimeout(idle.current);
    };
  }, [resetIdle]);
  function capture() {
    if (timer.current) return;
    setCount(3);
    let remaining = 3;
    timer.current = setInterval(() => {
      remaining--;
      if (remaining === 0) {
        clearInterval(timer.current!);
        timer.current = null;
        setCount(null);
        setCaptured(true);
      } else setCount(remaining);
    }, 1000);
  }
  async function save() {
    if (!image.current || saving) return;
    setSaving(true);
    setError("");
    let source = "";
    let download = "";
    try {
      // SVG images loaded through an <img> cannot fetch nested external assets.
      const snapshot = image.current.cloneNode(true) as SVGSVGElement;
      const assets = new Map<string, Promise<string>>();
      await Promise.all(
        Array.from(snapshot.querySelectorAll("image")).map(async (node) => {
          const href = node.getAttribute("href");
          if (!href || href.startsWith("data:")) return;
          if (!assets.has(href))
            assets.set(
              href,
              (async () => {
                const response = await fetch(href);
                if (!response.ok)
                  throw new Error("Character image could not be loaded");
                const blob = await response.blob();
                return new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(String(reader.result));
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              })(),
            );
          node.setAttribute("href", await assets.get(href)!);
        }),
      );
      snapshot.setAttribute("width", "600");
      snapshot.setAttribute("height", "700");
      snapshot.removeAttribute("class");
      source = URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(snapshot)], {
          type: "image/svg+xml;charset=utf-8",
        }),
      );
      const img = new Image();
      img.src = source;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1400;
      const context = canvas.getContext("2d");
      if (!context) throw new Error();
      context.drawImage(img, 0, 0, 1200, 1400);
      const anchor = document.createElement("a");
      anchor.download = "little-lovely-memory.png";
      const png = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("PNG export failed")),
          "image/png",
        ),
      );
      download = URL.createObjectURL(png);
      anchor.href = download;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch {
      setError("이미지를 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      if (source) URL.revokeObjectURL(source);
      if (download) setTimeout(() => URL.revokeObjectURL(download), 1000);
      setSaving(false);
    }
  }
  const colors = backgrounds[background];
  return (
    <main
      className={styles.lounge}
      onPointerDown={resetIdle}
      onKeyDown={resetIdle}
    >
      <header className={styles.topbar}>
        <Link href="/" className={styles.back}>
          ← 놀이 고르기
        </Link>
        <span className={styles.wordmark}>
          몽글몽글 <span>PHOTO TIME</span>
        </span>
        <span className={styles.pill}>A LITTLE SOUVENIR</span>
      </header>
      <div className={styles.gameHeading}>
        <p className={styles.eyebrow}>게임 사이, 잠깐 쉬어 가기</p>
        <h1>오늘의 작은 기념사진</h1>
        <p>배경과 친구들의 포즈를 골라 캐릭터 기념사진을 만들어 보세요.</p>
      </div>
      <div className={styles.photoLayout}>
        <div className={styles.photoStage}>
          <svg
            ref={image}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 700"
            className={styles.postcard}
            role="img"
            aria-label="캐릭터 기념사진"
          >
            <rect width="600" height="700" rx="12" fill="#fffdf7" />
            <rect
              x="26"
              y="26"
              width="548"
              height="535"
              rx="7"
              fill={colors.sky}
            />
            <circle cx="475" cy="120" r="42" fill="#fff5ce" />
            <path d="M26 435Q300 310 574 435V561H26Z" fill={colors.ground} />
            <text
              x="300"
              y="108"
              textAnchor="middle"
              fill="#817465"
              fontSize="14"
              letterSpacing="4"
              fontFamily="sans-serif"
            >
              A LITTLE LOVELY DAY
            </text>
            <text x="95" y="190" fill="#b2a080" fontSize="45">
              ✦
            </text>
            <text x="460" y="270" fill="#b2a080" fontSize="30">
              ✿
            </text>
            {(["bao", "dasoni", "nani"] as const).map((kind, i) => (
              <g
                key={kind}
                transform={`translate(${35 + i * 165},${pose === 1 ? (i % 2 ? 255 : 300) : 310}) rotate(${pose === 1 ? (i - 1) * 12 : pose === 2 ? (i - 1) * 8 : 0} 100 100)`}
              >
                <Friend kind={kind} size={190} />
              </g>
            ))}
            <text
              x="300"
              y="610"
              textAnchor="middle"
              fontSize="23"
              fill="#675d51"
              fontFamily="sans-serif"
            >
              작고 귀여운 오늘을 기억해
            </text>
            <text
              x="300"
              y="649"
              textAnchor="middle"
              fontSize="11"
              letterSpacing="3"
              fill="#a39682"
              fontFamily="sans-serif"
            >
              PLAY LOUNGE · LITTLE MEMORIES
            </text>
          </svg>
          {count !== null && (
            <div className={styles.countdown} role="status">
              {count}
            </div>
          )}
        </div>
        <div className={styles.photoOptions}>
          {captured ? (
            <>
              <span className={styles.eyebrow}>
                ONE LITTLE MEMORY, JUST FOR YOU
              </span>
              <h2>귀여운 순간을 담았어요!</h2>
              <p>
                사진을 PNG 이미지로 저장할 수 있어요.
                <br />
                다음 친구를 위해 1분 동안 터치가 없으면 메인으로 돌아가요.
              </p>
              <button
                className={styles.primary}
                disabled={saving}
                onClick={() => void save()}
              >
                {saving ? "저장 준비 중…" : "기념사진 저장하기 ↓"}
              </button>
              <button
                className={styles.secondary}
                onClick={() => setCaptured(false)}
              >
                다른 포즈로 다시 찍기
              </button>
            </>
          ) : (
            <>
              <fieldset disabled={count !== null}>
                <legend>01. 배경을 골라 주세요</legend>
                <div>
                  {backgrounds.map((b, i) => (
                    <button
                      key={b.name}
                      aria-pressed={background === i}
                      onClick={() => setBackground(i)}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset disabled={count !== null}>
                <legend>02. 친구들은 어떤 포즈로?</legend>
                <div>
                  {poses.map((name, i) => (
                    <button
                      key={name}
                      aria-pressed={pose === i}
                      onClick={() => setPose(i)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </fieldset>
              <p>
                점수도, 제한 시간도 없는 작은 쉬어 가기.
                <br />
                포즈를 고르고 셋을 세면 찰칵!
              </p>
              <button
                className={styles.primary}
                disabled={count !== null}
                onClick={capture}
              >
                {count !== null ? "하나, 둘, 셋…" : "이 포즈로 찰칵!"}
              </button>
            </>
          )}
          {error && <p role="alert">{error}</p>}
          <Link href="/" className={styles.back}>
            다른 놀이 보러 가기 ↗
          </Link>
        </div>
      </div>
      <footer className={styles.bottom}>
        <span>카메라 없이 만드는 캐릭터 기념사진이에요.</span>
        <span>ORIGINAL CHARACTER PLAY LOUNGE · PORTFOLIO</span>
      </footer>
    </main>
  );
}
