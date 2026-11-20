/**
 * Worker 의 파싱·분류·ID 생성이 파이썬 쪽과 같은 결과를 내는지 검증한다.
 *
 * 왜 필요한가: 같은 규칙을 두 언어로 옮겨 적었다. 한쪽만 고치는 순간
 * 같은 과제가 서로 다른 ID 를 갖게 되고, 동기화할 때마다 항목이 늘어난다.
 *
 * 사용: node deploy/test.mjs <일정.ics 경로>
 */
import { readFileSync } from "node:fs";
import { h32, idFor, parseIcs, classify, formBody, findIcsUrl, findName, parseUpcoming, courseIds, dueTimeFor } from "./src/worker.js";

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

console.log("\n4-1. 강의는 열리는 날(due)과 닫히는 날(closes)을 따로 든다");
check("4주차 Stack 은 10-06 에 닫힌다", stack && stack.closes, "2026-10-06");
check("과제에는 closes 가 없다", hw.every((e) => e.closes === null), true);

console.log("\n5. 과제 ID 가 파이썬 시드와 같은가");
const jarvis = hw.find((e) => e.title.includes("자비스"));
check("나만의_자비스_만들기 ID", jarvis && idFor(jarvis.course, jarvis.title, "2026-09-25"), "20260925_335ac104");
const ml = hw.find((e) => e.course === "머신러닝");
check("머신러닝 3주차 과제 ID", ml && idFor(ml.course, ml.title, ml.due), "20260928_3796da53");

console.log("\n6. 제외 규칙");
check("신입생세미나 항목 없음", items.filter((e) => e.course.includes("신입생세미나")).length, 0);

console.log("\n7. 달력 내보내기 폼을 채우고 주소를 꺼내는가 (로그인 흐름)");
const form = formBody(`<input type="hidden" name="sesskey" value="AbC1">
  <input type="radio" name="events[exportevents]" value="all"><input type="radio" name="events[exportevents]" value="courses">
  <input type="radio" name="period[timeperiod]" value="weeknow"><input type="radio" name="period[timeperiod]" value="recentupcoming">`);
check("sesskey 를 그대로 싣는다", form.get("sesskey"), "AbC1");
check("모든 이벤트를 고른다", form.get("events[exportevents]"), "all");
check("최근·다가오는 일정을 고른다", form.get("period[timeperiod]"), "recentupcoming");
check("칸을 못 찾으면 옛 이름도 보낸다", formBody("").get("preset_what"), "all");
const EXPORT = "https://ecampus.kangnam.ac.kr/calendar/export_execute.php";
check("&amp; 를 풀어 주소를 꺼낸다",
  findIcsUrl(`<div>${EXPORT}?userid=12&amp;authtoken=ab12&amp;preset_what=all</div>`),
  `${EXPORT}?userid=12&authtoken=ab12&preset_what=all`);
check("이캠퍼스 밖 주소는 받지 않는다",
  findIcsUrl("https://evil.example/calendar/export_execute.php?userid=1&authtoken=a"), null);

console.log("\n8. 다가오는 일정 화면에서 정확한 마감 시각을 읽는가");
// 2026-11-13 에 저장한 실제 화면의 모양을 그대로 옮겼다(내용은 지어낸 것).
const DAY = "https://ecampus.kangnam.ac.kr/calendar/view.php?view=day&amp;time=";
const sec = (iso) => Date.parse(iso) / 1000;
const noon = sec("2026-11-16T12:00:00+09:00");
const upcoming = `<select class="select" name="course"><option value="1">모든 강좌</option>
  <option value="52368">머신러닝[01]</option><option value="52382">네트워크서비스[01]</option></select>
  <div class="eventlist"><div class="event" id="event_325557"><div class="card"><h3 class="referer"><a href="#">과제2</a></h3>
  <span class="date pull-xs-right m-r-1" id="yui_1"><a href="${DAY}${noon}">2026년 11월 16일(월요일), </a>12:00</span></div></div>
  <div class="event" id="event_222473"><span class="date"><a href="${DAY}${sec("2023-08-14T00:00:00+09:00")}">2023년 8월 14일(월요일), </a>00:00
  <strong>»</strong> <a href="${DAY}${sec("2029-02-28T23:59:59+09:00")}" id="yui_2">2029년 2월 28일(수요일), </a>23:59</span></div>
  <div class="event" id="event_7"><span class="date"><a href="${DAY}${sec("2026-11-20T00:00:00+09:00")}">내일, </a>오후 6:30</span></div></div>`;
const seen = parseUpcoming(upcoming);
check("일정 번호별로 시각을 꺼낸다", seen["325557"] && seen["325557"][0], noon);
check("기간이 있는 일정은 시작·끝 둘 다", seen["222473"] && seen["222473"].length, 2);
check("링크가 자정만 가리키면 적힌 시각을 따른다", seen["7"] && seen["7"][0], sec("2026-11-20T18:30:00+09:00"));
check("과목 번호에서 '모든 강좌'는 뺀다", courseIds(upcoming).join(","), "52368,52382");
check("낮 12시 마감", dueTimeFor("2026-11-16", [noon]), "12:00");
check("자정 마감은 24:00", dueTimeFor("2026-09-24", [sec("2026-09-25T00:00:00+09:00")]), "24:00");
check("다음 날 새벽은 24 를 넘겨 적는다", dueTimeFor("2026-11-16", [sec("2026-11-17T08:00:00+09:00")]), "32:00");
check("날짜가 동떨어지면 버린다", dueTimeFor("2026-11-16", [sec("2026-11-19T12:00:00+09:00")]), null);
const uidEv = parseIcs("BEGIN:VEVENT\nUID:325557@ecampus.kangnam.ac.kr\nSUMMARY:과제2\nDTSTART;VALUE=DATE:20261116\nCATEGORIES:머신러닝(2026년도\\, 2학기\\, EB14202\\, 01)\nEND:VEVENT").map(classify)[0];
check("iCal 의 일정 번호를 든다", uidEv && uidEv.uid, "325557");

console.log("\n9. 하루 보기 화면 — 날짜 없이 시각만 적힌다");
// 다가오는 일정에는 며칠 안에 닥친 것만 나와서, 과제가 걸린 날의 화면을 따로 연다.
const day20 = sec("2026-11-20T00:00:00+09:00");
const dayView = `<div class="eventlist"><div class="event" id="event_326075"><h3 class="referer"><a href="#">과제 제출</a></h3>
  <span class="date pull-xs-right m-r-1">00:00</span></div>
  <div class="event" id="event_9"><span class="date">오후 11:50</span></div></div>`;
const onDay = parseUpcoming(dayView, day20);
check("그 날의 자정에 시각을 더한다", onDay["326075"] && onDay["326075"][0], day20);
check("오전·오후 표기", onDay["9"] && onDay["9"][0], sec("2026-11-20T23:50:00+09:00"));
// 2026-11-13 실제로 겪었다: 20일 00:00 마감인 과제가 iCal 에는 19일로 온다.
check("iCal 날짜 다음 날 자정 → 24:00", dueTimeFor("2026-11-19", onDay["326075"]), "24:00");
check("날짜를 모르면 시각만으로는 넣지 않는다", Object.keys(parseUpcoming(dayView)).length, 0);
check("일정 없는 화면은 빈 결과", Object.keys(parseUpcoming("<div>계획된 일정이 없습니다.</div>", day20)).length, 0);

console.log("\n10. 이캠퍼스 화면에서 이름을 읽는가 (학번 대신 보여 준다)");
// 2026-11-13 에 저장한 실제 화면의 모양(이름은 지어낸 것).
const header = `<ul class="nav nav-pills"><li class="user-info-change"></li><li class="user_department hidden-xs">홍길동</li>
  <div class="user-info-picture"><img src="f1.png" alt="홍길동 사진" class="userpicture"><h4>홍길동</h4><p class="department">ICT융합공학부</p></div></ul>`;
check("내정보의 이름", findName(header), "홍길동");
check("내정보가 없으면 위쪽 이름", findName('<li class="user_department hidden-xs"> 홍길동 </li>'), "홍길동");
check("못 찾으면 null", findName("<h4>공지</h4>"), null);

console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);
