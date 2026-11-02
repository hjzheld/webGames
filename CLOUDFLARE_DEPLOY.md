# Cloudflare Workers 배포

네 게임과 사진관으로 구성한 Next.js 앱을 OpenNext로 배포합니다.
DB·로그인·비밀키 설정은 필요하지 않습니다.
Worker 이름은 `wrangler.jsonc`의 `mongle-play-lounge`입니다.

## 로컬 확인

```sh
npm ci
npm run cf:build
npm run cf:preview
```

Windows에서 어댑터 빌드가 실패하면 WSL이나 Linux CI에서 같은 명령을 실행합니다.

## 첫 배포

```sh
npx wrangler login
npm run cf:deploy
```

성공하면 CLI에 표시되는 `workers.dev` 주소로 접속합니다.
공유 이미지 주소를 위해 빌드 환경 변수 `NEXT_PUBLIC_SITE_URL`을 발급받은 실제 HTTPS 주소로 설정한 뒤 다시 빌드·배포하세요.
예: `https://mongle-play-lounge.실제계정.workers.dev`.

메인·게임·사진관은 빌드 시 생성하며 Workers Static Assets 캐시를 사용합니다.
콘텐츠 변경은 다시 빌드해서 배포합니다.

## Git 연결

Cloudflare 대시보드에서 Worker 생성 후 Git 저장소를 연결합니다.
빌드 명령: `npm run cf:build`.
배포 명령: `npx opennextjs-cloudflare deploy`.
빌드 환경 변수에 `NEXT_PUBLIC_SITE_URL`을 등록하세요.

공식 문서: https://opennext.js.org/cloudflare/get-started
