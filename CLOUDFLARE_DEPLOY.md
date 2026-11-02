# Cloudflare Pages 배포

일반 Cloudflare 계정을 만들고 이메일 인증까지 완료하면 됩니다.
도메인 구매, DB, 비밀키, Workers 유료 플랜은 필요하지 않습니다.
배포 후 `프로젝트명.pages.dev` 기본 주소를 사용합니다.

## GitHub 연결로 배포

1. Cloudflare의 **Workers & Pages**에서 **Pages 프로젝트 생성 → Git 저장소 연결**을 선택합니다.
2. 개인 GitHub 계정으로 연결하고 `hjzheld/webGames` 저장소를 선택합니다.
3. 배포 브랜치는 `main`으로 지정합니다.
4. 아래 빌드 설정을 입력하고 배포합니다.

| 항목 | 값 |
| --- | --- |
| 프레임워크 프리셋 | Next.js (Static HTML Export) |
| 빌드 명령 | `npm run build` |
| 빌드 출력 디렉터리 | `out` |
| 루트 디렉터리 | 저장소 루트, 별도 하위 경로 없음 |
| 빌드 환경 변수 `NODE_VERSION` | `24` |
| 빌드 환경 변수 `NEXT_PUBLIC_SITE_URL` | 발급받을 실제 `https://프로젝트명.pages.dev` |

사이트 주소가 확정된 뒤 `NEXT_PUBLIC_SITE_URL`을 실제 주소로 맞추고 다시 배포하세요.
OG 이미지와 공유 미리보기의 절대 주소에 사용합니다. 환경 파일은 Git에 올리지 않습니다.
연결 후 `main`에 push하면 Pages가 자동으로 빌드·배포합니다.

## 로컬 확인

```sh
npm ci
npm run build
npm run start
```

`out/`에 HTML·CSS·JS·이미지만 생성됩니다. `start`는 이 정적 결과물을 Pages 로컬 서버로 제공합니다.
일반 개발은 기존처럼 `npm run dev`를 사용합니다.

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

E2E도 Next.js 서버 대신 실제 Pages 정적 서버를 사용합니다.

## CLI 배포를 선택할 경우

GitHub 자동 배포를 사용하면 이 단계는 생략해도 됩니다.

```sh
npx wrangler login
npm run cf:deploy
```

CLI 기본 프로젝트 이름은 `mongle-play-lounge`입니다.
다른 Pages 프로젝트로 배포한다면 `wrangler.jsonc`의 `name`과 `cf:deploy`의 `--project-name`을 같은 이름으로 변경하세요.
`npm run cf:build`는 정적 빌드, `npm run cf:preview`는 빌드 후 로컬 Pages 미리보기입니다.
OpenNext·Workers 서비스 바인딩·서버 API는 사용하지 않습니다.

공식 안내: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
