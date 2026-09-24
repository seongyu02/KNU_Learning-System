/**
 * Worker 의 파싱·분류·ID 생성이 파이썬 쪽과 같은 결과를 내는지 검증한다.
 *
 * 왜 필요한가: 같은 규칙을 두 언어로 옮겨 적었다. 한쪽만 고치는 순간
 * 같은 과제가 서로 다른 ID 를 갖게 되고, 동기화할 때마다 항목이 늘어난다.
 *
 * 사용: node deploy/test.mjs <일정.ics 경로>
 */
import { readFileSync } from "node:fs";
import { h32, idFor, parseIcs, classify } from "./src/worker.js";

const path = process.argv[2];
if (!path) {
  console.error("사용: node deploy/test.mjs <일정.ics 경로>");
  process.exit(2);
}

let pass = 0, fail = 0;
const check = (name, got, want) => {
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${ok ? "" : `\n        기대: ${want}\n        실제: ${got}`}`);
};

console.log("1. 해시가 파이썬과 같은가 (파이썬 mkseed.py 출력값과 대조)");
check("네트워크서비스|나만의_자비스_만들기", h32("네트워크서비스|나만의_자비스_만들기"), "335ac104");
check("머신러닝|2026년_2학기_3주차_머신러닝_과제", h32("머신러닝|2026년_2학기_3주차_머신러닝_과제"), "3796da53");

console.log("\n2. NFD(분해형 한글)를 NFC 로 모으는가");
const nfd = "나만의_자비스_만들기".normalize("NFD");
check("NFD 입력이 NFC 와 같은 해시", h32("네트워크서비스|" + nfd), h32("네트워크서비스|나만의_자비스_만들기"));

console.log("\n3. 실제 피드 분류");
const events = parseIcs(readFileSync(path, "utf8"));
const items = events.map(classify).filter(Boolean);
const hw = items.filter((e) => e.kind === "과제");
const vd = items.filter((e) => e.kind === "강의");
check("전체 VEVENT 수", events.length, 18);
check("과제 건수", hw.length, 4);
check("강의차시 건수", vd.length, 11);
check("비교과·제외 건수", events.length - items.length, 3);

console.log("\n4. UTC→KST 하루 밀림 보정");
const c41 = vd.find((e) => e.title.startsWith("4-1"));
check("네트워크서비스 4-1 은 금요일(09-25)", c41 && c41.due, "2026-09-25");
const stack = vd.find((e) => e.title.includes("Stack"));
check("게임프로그래밍 4주차는 화요일(09-22)", stack && stack.due, "2026-09-22");

console.log("\n5. 과제 ID 가 파이썬 시드와 같은가");
const jarvis = hw.find((e) => e.title.includes("자비스"));
check("나만의_자비스_만들기 ID", jarvis && idFor(jarvis.course, jarvis.title, "2026-09-25"), "20260925_335ac104");
const ml = hw.find((e) => e.course === "머신러닝");
check("머신러닝 3주차 과제 ID", ml && idFor(ml.course, ml.title, ml.due), "20260928_3796da53");

console.log("\n6. 제외 규칙");
check("신입생세미나 항목 없음", items.filter((e) => e.course.includes("신입생세미나")).length, 0);

console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);
