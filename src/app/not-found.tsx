import Link from "next/link";
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeContent: "center",
        textAlign: "center",
        gap: 20,
      }}
    >
      <span style={{ letterSpacing: 4 }}>몽글몽글 놀이터</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link href="/">놀이 고르기로 돌아가기 ↗</Link>
    </main>
  );
}
