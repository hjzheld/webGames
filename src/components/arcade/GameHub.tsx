import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { games } from "@/lib/arcade/catalog";
import Friend from "./Friend";
import styles from "./Lounge.module.scss";

export default function GameHub() {
  return (
    <main className={styles.lounge}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.wordmark}>
          몽글몽글 <span>PLAY LOUNGE</span>
        </Link>
      </header>
      <section
        className={styles.invitationHero}
        aria-label="기다리는 시간도 몽글몽글 즐겁게"
      >
        <h1 className={styles.srOnly}>기다리는 시간도 몽글몽글 즐겁게</h1>
        <svg
          className={styles.invitationArt}
          viewBox="0 0 700 660"
          role="img"
          aria-labelledby="invitation-title"
        >
          <title id="invitation-title">기다리는 시간도 몽글몽글 즐겁게</title>
          <defs>
            <pattern
              id="envelope-stripes"
              width="34"
              height="34"
              patternUnits="userSpaceOnUse"
            >
              <rect width="34" height="34" fill="#faf7ed" />
              <rect width="17" height="34" fill="#dae5e5" />
            </pattern>
            <filter
              id="letter-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="7"
                floodColor="#9c7770"
                floodOpacity=".16"
              />
            </filter>
          </defs>
          <g fill="#d1b573" fontSize="17" textAnchor="middle">
            <text x="104" y="152">
              ✧
            </text>
            <text x="568" y="99">
              ✧
            </text>
            <text x="158" y="75">
              ✧
            </text>
            <text x="615" y="254">
              ✧
            </text>
            <text x="81" y="354">
              ✧
            </text>
          </g>
          <g className={styles.envelopeDrawing} filter="url(#letter-shadow)">
            <path
              d="M130 319 Q130 260 184 224 L350 129 L516 224 Q570 260 570 319 L570 582 L130 582Z"
              fill="#efd6d0"
              stroke="#c9928b"
              strokeWidth="2"
            />
            <path
              d="M179 462 L179 225 Q179 192 209 190 Q210 156 245 151 Q254 115 291 116 Q310 73 350 73 Q390 73 409 116 Q446 115 455 151 Q490 156 491 190 Q521 192 521 225 L521 462Z"
              fill="#fffaf0"
              stroke="#c9958e"
              strokeWidth="2.5"
            />
            <path
              d="M187 450 L187 226 Q187 200 217 198 Q218 164 251 159 Q263 123 297 124 Q315 82 350 82 Q385 82 403 124 Q437 123 449 159 Q482 164 483 198 Q513 200 513 226 L513 450"
              fill="none"
              stroke="#ead4c6"
            />
            <text
              x="350"
              y="256"
              textAnchor="middle"
              fill="#8d7970"
              fontSize="21"
              fontFamily="var(--font-gowun-dodum)"
            >
              기다리는 시간도
            </text>
            <text
              x="350"
              y="302"
              textAnchor="middle"
              fill="#aa7778"
              fontSize="35"
              fontFamily="var(--font-jua)"
            >
              몽글몽글 즐겁게
            </text>
            <text
              x="350"
              y="339"
              textAnchor="middle"
              fill="#a08c7d"
              fontSize="10"
              letterSpacing="3"
            >
              A LETTER FOR YOUR LOVELY WAIT
            </text>
            <path
              d="M130 319 L350 490 L570 319 L570 582 L130 582Z"
              fill="url(#envelope-stripes)"
              stroke="#c9958e"
              strokeWidth="2.5"
            />
            <path
              d="M130 582 L328 402 Q350 383 372 402 L570 582Z"
              fill="url(#envelope-stripes)"
              stroke="#c9958e"
              strokeWidth="2.5"
            />
            <path
              d="M138 571 L329 407 Q350 390 371 407 L562 571"
              fill="none"
              stroke="#e4bbb2"
              strokeWidth="2"
            />
          </g>
          <g fill="none" stroke="#9ba27a" strokeWidth="1.7">
            <path d="M587 578q-17-52 9-115m-4 51q24-15 23-35m-25 56q-23-10-24-30M110 578q9-46-12-83" />
            <path
              d="M596 494q-15-16-10-25 17 6 10 25m-5 53q18-19 27-13-5 17-27 13m-484 5q-21-12-24-5 5 16 24 5"
              fill="#ccd0ae"
            />
          </g>
          <g fill="#e8bdba" stroke="#be8f88">
            <circle cx="599" cy="463" r="7" />
            <circle cx="592" cy="457" r="6" />
            <circle cx="604" cy="454" r="6" />
            <circle cx="99" cy="492" r="7" />
          </g>
        </svg>
      </section>
      <section aria-label="게임 선택">
        <div className={styles.sectionHeading}>
          <h2>오늘은 어떤 놀이를 골라볼까?</h2>
          <span>CHOOSE YOUR LITTLE ADVENTURE</span>
        </div>
        <div className={styles.cards}>
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/play/${game.id}`}
              className={styles.card}
              style={
                {
                  "--card-color": game.color,
                  "--accent": game.accent,
                } as React.CSSProperties
              }
            >
              <div className={styles.cardTop}>
                <span>GAME {game.number}</span>
                <span>
                  <Clock3 size={13} strokeWidth={1.8} /> 약{" "}
                  {Math.max(1, Math.ceil(game.duration / 60))}분
                </span>
              </div>
              <div className={styles.cardArt}>
                <Friend kind={game.friend} />
              </div>
              <div className={styles.cardBody}>
                <small>{game.subtitle}</small>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <div>
                  <span>{game.tag}</span>
                  <b aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={1.8} />
                  </b>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Link href="/photo" className={styles.souvenirInvitation}>
        <svg
          className={styles.souvenirFrame}
          viewBox="0 0 1000 280"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M35 12H965Q965 35 988 35V245Q965 245 965 268H35Q35 245 12 245V35Q35 35 35 12Z"
            fill="none"
            stroke="currentColor"
          />
        </svg>
        <small>YOU ARE INVITED</small>
        <h2>오늘의 순간을 엽서처럼</h2>
        <p>친구들과 함께한 시간을 한 장의 추억으로 남겨요.</p>
        <svg
          className={styles.heartLock}
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <path
            d="M40 47V32C40 4 80 4 80 32V47"
            fill="none"
            stroke="#b78c86"
            strokeWidth="3"
          />
          <path
            d="M45 44V32C45 12 75 12 75 32V44"
            fill="none"
            stroke="#d6b6a8"
            strokeWidth="2"
          />
          <path
            d="M60 49C25 23 8 55 27 77L60 108L93 77C112 55 95 23 60 49Z"
            fill="#edbfc4"
            stroke="#bc858e"
            strokeWidth="2"
          />
          <path
            d="M60 57C31 32 18 58 33 75L60 100L87 75C102 58 89 32 60 57Z"
            fill="none"
            stroke="#f9e1dc"
          />
        </svg>
        <span className={styles.souvenirAction}>
          사진관 열기 <ArrowUpRight size={14} />
        </span>
      </Link>
      <footer className={styles.bottom}>
        <span>몽글몽글한 기다림, 함께해 줘서 고마워요.</span>
        <span>ORIGINAL CHARACTER PLAY LOUNGE · PORTFOLIO</span>
      </footer>
    </main>
  );
}
