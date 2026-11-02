# 몽글몽글 놀이터

팝업스토어 방문객이 기다리는 동안 즐기는 네 가지 게임과 캐릭터 사진관입니다.
Next.js App Router, React, TypeScript, SCSS Modules, Lucide 아이콘을 사용합니다.

## 실행

Node.js 22.12 이상 또는 24 이상이 필요합니다.

```sh
npm ci
npm run dev
```

기본 주소는 `http://localhost:3000`입니다. DB나 로그인 없이 모든 게임이 동작합니다.

## 화면

| 주소 | 기능 |
| --- | --- |
| `/` | 게임 선택 |
| `/play/weeding` | 다소니의 풀 뽑기 |
| `/play/snacks` | 푸실의 간식 받기 |
| `/play/training` | 나니의 토벌 연습 |
| `/play/memory` | 바오의 짝 맞추기 |
| `/photo` | 캐릭터 사진관·PNG 저장 |

## 유지보수

- `src/lib/arcade/catalog.ts`: 게임 이름·규칙·시간·캐릭터·색상.
- `src/hooks/useArcadeRound.ts`: 타이머·점수·라운드 상태.
- `src/components/arcade/GameScreen.tsx`: 공통 준비·플레이·결과 화면.
- `src/components/arcade/games/`: 게임별 입력과 판정.
- `src/components/arcade/Lounge.module.scss`: 공통 및 PC 스타일.
- `src/components/arcade/Lounge.mobile.css`: 모바일·태블릿 스타일 전체.
- `src/components/arcade/Friend.tsx`, `public/characters/`: 원본 캐릭터 투명 WebP.
- `src/app/`: 페이지·OG 이미지·파비콘.

모바일은 480px 이하에서 메인 카드를 한 열로 표시합니다. 짝 맞추기는 3×4이며 토벌 높이 축소는 800px 이하에서 적용합니다.
폰트는 Fontsource의 고운돋움·주아체를 자체 제공합니다.

## 검증

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

브라우저 검사는 로컬 Chrome을 사용합니다. `npm run test:capture:lounge`와 `node scripts/check-mobile.mjs`로 화면을 캡처할 수 있습니다.
`npm run brand:generate`는 실행 중인 개발 서버에서 OG 이미지와 아이콘을 다시 생성합니다.

## 배포

Cloudflare Workers 설정을 포함합니다. `CLOUDFLARE_DEPLOY.md`를 참고하세요.
공유 이미지의 절대 주소를 위해 빌드 환경 변수 `NEXT_PUBLIC_SITE_URL`을 실제 HTTPS 주소로 설정합니다.
