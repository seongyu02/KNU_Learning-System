/**
 * 공격을 직접 해 본다. Worker 를 이 파일 안에서 그대로 돌리고, 이캠퍼스는 가짜를 세운다 —
 * 진짜 이캠퍼스나 운영 서버에는 요청이 한 건도 나가지 않는다.
 *
 * 왜 필요한가: "막았다"고 적어 둔 것이 정말 막히는지는 뚫어 봐야 안다. 한꺼번에 쏘는
 * 비밀번호 찍기처럼 요청 하나씩 보내서는 안 드러나는 구멍이 있다.
 *
 * 사용: cd deploy && python build.py && node security.test.mjs      (Node 22.5 이상)
 * 각 줄은 "공격이 막혔는가"다. 실패 0 이어야 배포한다.
 */
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "./src/worker.js";

const here = (name) => new URL(name, import.meta.url);
const BASE = "https://dd.test";
const ECAMPUS = "https://ecampus.kangnam.ac.kr";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 가짜 D1 ────────────────────────────────────────────────────────
const sqlite = new DatabaseSync(":memory:");
sqlite.exec(readFileSync(here("schema.sql"), "utf8"));
let queries = 0, breakDb = false;
const stmt = (sql, args = []) => ({
  bind: (...a) => stmt(sql, a),
  sql, args,
  async first() { queries++; return sqlite.prepare(sql).get(...args) ?? null; },
  async all() { queries++; return { results: sqlite.prepare(sql).all(...args) }; },
  async run() { queries++; const r = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
});
const DB = {
  prepare(sql) { if (breakDb) throw new Error("D1_ERROR: secret-internal-detail"); return stmt(sql); },
  async batch(list) {
    const out = [];
    for (const s of list) out.push(/^\s*SELECT/i.test(s.sql) ? await s.all() : await s.run());
    return out;
  },
};
const rows = (sql, ...args) => sqlite.prepare(sql).all(...args);
const dump = () => JSON.stringify(["users", "sessions", "login_fail", "items", "logs", "sync_log"].map((t) => rows(`SELECT * FROM ${t}`)));

// ── 가짜 이캠퍼스 ──────────────────────────────────────────────────
const ACCOUNTS = {
  "20250001": { pw: "right-A!pw", n: 101, name: "가나다" },
  "20250002": { pw: "right-B!pw", n: 102, name: `라마"onx='1` },
  "20250099": { pw: "owner-pw!!", n: 199, name: "만든이" },
  abcd1234: { pw: "right-C!pw", n: 103, name: "영문" },
};
const XSS = `<img src=x onerror="window.__x=1"><script>window.__x=2</script>`;
const eca = { tries: 0, feeds: 0 };
const feed = () => ["BEGIN:VCALENDAR",
  "BEGIN:VEVENT", "UID:1@ecampus.kangnam.ac.kr", `SUMMARY:${XSS}`, "DTSTART;VALUE=DATE:20270115",
  "CATEGORIES:공격과목(2026년도\\, 2학기\\, EB14202\\, 01)", "END:VEVENT",
  "BEGIN:VEVENT", "UID:2@ecampus.kangnam.ac.kr", "SUMMARY:보통 과제", "DTSTART;VALUE=DATE:20270120",
  "CATEGORIES:보통과목(2026년도\\, 2학기\\, EB14203\\, 01)", "END:VEVENT",
  "END:VCALENDAR"].join("\r\n");

globalThis.fetch = async (input, init = {}) => {
  await sleep(3); // 진짜처럼 조금 걸려야 한꺼번에 쏜 요청들이 서로 엇갈린다
  const url = new URL(typeof input === "string" ? input : input.url);
  if (url.origin !== ECAMPUS) throw new Error("이캠퍼스 밖으로 요청이 나갔다: " + url.origin);
  const cookie = new Headers(init.headers).get("cookie") || "";
  const who = (/MoodleSession=u-(\w+)/.exec(cookie) || [])[1];
  const page = (body, headers = {}) => new Response(body, { status: 200, headers });
  const go = (to, headers = {}) => new Response(null, { status: 303, headers: { location: to, ...headers } });
  const p = url.pathname;
  if (p === "/login.php") return page(`<input type="hidden" name="logintoken" value="tok">`, { "set-cookie": "MoodleSession=anon; path=/" });
  if (p === "/login/index.php") {
    eca.tries++;
    const f = new URLSearchParams(String(init.body));
    const acc = ACCOUNTS[f.get("username")];
    return acc && acc.pw === f.get("password")
      ? go(ECAMPUS + "/", { "set-cookie": `MoodleSession=u-${f.get("username")}; path=/` })
      : go(ECAMPUS + "/login.php?errorcode=3");
  }
  if (p === "/calendar/export.php") {
    if (!who) return page(`<body class="notloggedin">`);
    if ((init.method || "GET") === "GET") return page(`<script>M.cfg={"sesskey":"abc"}</script><li class="user_department hidden-xs">${ACCOUNTS[who].name}</li>`);
    return page(`<div>${ECAMPUS}/calendar/export_execute.php?userid=${ACCOUNTS[who].n}&amp;authtoken=feedsecret${ACCOUNTS[who].n}&amp;preset_what=all</div>`);
  }
  if (p === "/calendar/export_execute.php") { eca.feeds++; return page(feed()); }
  return page("<div></div>");
};

// ── 요청 보내기 ────────────────────────────────────────────────────
const env = {
  DB, DATA_KEY: "test-data-key-0123456789", OWNER_ID: "20250099", VIEW_TOKEN: "view-token-Zx81-very-long-and-random",
  ASSETS: { fetch: async () => new Response(readFileSync(here("public/app.html"), "utf8")) },
};
const pending = [];
const ctx = { waitUntil: (p) => pending.push(p) };

/** origin 을 안 주면 같은 출처로 보낸다. null 을 주면 Origin 헤더를 뺀다. */
async function call(path, o = {}) {
  const method = o.method || "GET";
  const headers = { "cf-connecting-ip": o.ip || "203.0.113.9", ...(o.headers || {}) };
  if (o.cookie) headers.cookie = o.cookie;
  if (method !== "GET" && o.origin !== null) headers.origin = o.origin || BASE;
  let body = o.body;
  if (body && typeof body === "object" && !(body instanceof URLSearchParams)) {
    body = JSON.stringify(body);
    headers["content-type"] ||= "application/json";
  }
  if (body instanceof URLSearchParams) { body = body.toString(); headers["content-type"] ||= "application/x-www-form-urlencoded"; }
  const res = await worker.fetch(new Request(BASE + path, { method, headers, body }), env, ctx);
  await Promise.all(pending.splice(0));
  return res;
}
const login = (username, password, ip, extra = {}) =>
  call("/login", { method: "POST", ip, body: new URLSearchParams({ username, password }), ...extra });
const sessionOf = (res) => {
  const c = res.headers.getSetCookie().find((x) => x.startsWith("dd_session=") && !x.startsWith("dd_session=;"));
  return c ? c.split(";")[0] : null;
};
const item = (title, more = {}) => ({ title, course: "과목", kind: "과제", due: "2027-01-10", dueTime: null, closes: null, estimate: null, status: "미착수", source: "수동", note: "", ...more });
const backdate = (minutes) => sqlite.prepare(`UPDATE login_fail SET at=?`).run(new Date(Date.now() - minutes * 60e3).toISOString());

let pass = 0, fail = 0;
const check = (name, ok, got) => {
  ok ? pass++ : fail++;
  console.log(`  ${ok ? "막힘" : "뚫림"}  ${name}${ok || got === undefined ? "" : `  → ${typeof got === "string" ? got : JSON.stringify(got)}`}`);
};
const section = (t) => console.log("\n" + t);

// ══ 1. 비밀번호 찍어 보기 ══════════════════════════════════════════
section("1. 비밀번호 찍어 보기");
{
  eca.tries = 0;
  const all = await Promise.all(Array.from({ length: 40 }, (_, i) => login("20250001", "guess" + i, "198.51.100.1")));
  check("한 아이디에 40번을 한꺼번에 쏴도 이캠퍼스까지 가는 것은 5번 이하", eca.tries <= 5, eca.tries + "번 통과");
  check("  나머지는 429 로 돌려보낸다", all.filter((r) => r.status === 429).length >= 35, all.map((r) => r.status).join(","));

  // 한꺼번에 쏜 것은 서로를 세어서 전부 거절될 수 있다. 하나씩 틀려서 잠금을 확실히 건다.
  for (let i = 0; i < 6; i++) await login("20250001", "seq" + i, "198.51.100.1");
  const before = rows(`SELECT COUNT(*) n FROM login_fail WHERE key='u:20250001'`)[0].n;
  check("  하나씩 틀려도 5번에서 잠긴다", before === 5 && eca.tries <= 5, { before, tries: eca.tries });
  for (let i = 0; i < 15; i++) await login("20250001", "more" + i, "198.51.100.1");
  const after = rows(`SELECT COUNT(*) n FROM login_fail WHERE key='u:20250001'`)[0].n;
  check("잠긴 동안 계속 두드려도 잠금이 길어지지 않는다 (남의 아이디를 계속 잠가 둘 수 없다)", after === before, { before, after });

  check("잠긴 동안에는 맞는 비밀번호도 안 받는다", (await login("20250001", ACCOUNTS["20250001"].pw, "198.51.100.2")).status === 429);
  backdate(11);
  check("10분이 지나면 주인은 다시 들어온다", (await login("20250001", ACCOUNTS["20250001"].pw, "198.51.100.2")).status === 303);

  sqlite.exec(`DELETE FROM login_fail`);
  eca.tries = 0;
  for (let i = 0; i < 60; i++) await login("2026" + String(1000 + i), "Passw0rd!", "198.51.100.7");
  check("한 곳에서 아이디를 바꿔 가며 60번 찍어도 20번 이하만 간다", eca.tries <= 20, eca.tries + "번 통과");

  sqlite.exec(`DELETE FROM login_fail`);
  eca.tries = 0;
  for (let i = 0; i < 60; i++) await login("2027" + String(1000 + i), "Passw0rd!", "2001:db8:1:2:" + i.toString(16) + "::1");
  check("IPv6 주소 뒷자리를 바꿔 가며 찍어도 한 사람으로 센다", eca.tries <= 20, eca.tries + "번 통과");

  sqlite.exec(`DELETE FROM login_fail`);
  eca.tries = 0;
  for (const u of ["abcd1234", "Abcd1234", "ABCD1234", "aBcd1234", "abCd1234", "abcD1234", "ABcd1234", "abCD1234"]) {
    await login(u, "nope", "198.51.100." + (20 + eca.tries));
  }
  check("아이디의 대소문자를 바꿔 가며 찍어도 한 아이디로 센다", eca.tries <= 5, eca.tries + "번 통과");

  // 10분 한도 바로 아래로 천천히 찍는 공격. 하루치 한도가 따로 있어야 막힌다.
  sqlite.exec(`DELETE FROM login_fail`);
  const old = new Date(Date.now() - 3 * 3600e3).toISOString();
  const ins = sqlite.prepare(`INSERT INTO login_fail (key,at) VALUES (?,?)`);
  for (let i = 0; i < 25; i++) ins.run("u:20250002", old);
  eca.tries = 0;
  await login("20250002", "slow-guess", "198.51.100.40");
  check("10분 한도 아래로 천천히 찍어도 하루 한도에 걸린다 (아이디)", eca.tries === 0, eca.tries + "번 통과");
  sqlite.exec(`DELETE FROM login_fail`);
  for (let i = 0; i < 250; i++) ins.run("i:198.51.100.41", old);
  eca.tries = 0;
  await login("20280001", "slow-guess", "198.51.100.41");
  check("10분 한도 아래로 천천히 찍어도 하루 한도에 걸린다 (접속한 곳)", eca.tries === 0, eca.tries + "번 통과");
  sqlite.exec(`DELETE FROM login_fail`);
}

// ══ 2. 로그인 · 세션 ═══════════════════════════════════════════════
section("2. 로그인 · 세션");
const resA = await login("20250001", ACCOUNTS["20250001"].pw, "203.0.113.1");
const resB = await login("20250002", ACCOUNTS["20250002"].pw, "203.0.113.2");
const A = sessionOf(resA), B = sessionOf(resB);
{
  check("(준비) 두 학생이 로그인된다", !!A && !!B && resA.status === 303);
  const d = dump();
  check("DB 어디에도 비밀번호가 없다", !d.includes(ACCOUNTS["20250001"].pw) && !d.includes(ACCOUNTS["20250002"].pw));
  check("DB 에 세션 원문이 없다 (해시만)", !d.includes(A.split("=")[1]) && !d.includes(B.split("=")[1]));
  check("DB 에 달력 주소 원문이 없다 (암호문만)", !d.includes("feedsecret") && !d.includes("export_execute"));
  const c = resA.headers.getSetCookie().find((x) => x.startsWith("dd_session="));
  check("세션 쿠키는 HttpOnly · Secure · SameSite", /HttpOnly/i.test(c) && /Secure/i.test(c) && /SameSite=(Lax|Strict)/i.test(c), c.replace(/=[0-9a-f]{20,}/, "=…"));
  check("세션 값은 256비트 난수", /^dd_session=[0-9a-f]{64}$/.test(A));

  check("지어낸 세션은 401", (await call("/api/items", { cookie: "dd_session=" + "c".repeat(64) })).status === 401);
  queries = 0;
  const bad = await call("/api/items", { cookie: "dd_session=' OR 1=1 --" });
  check("모양이 틀린 세션은 DB 를 열어 보지도 않고 거른다", bad.status === 401 && queries === 0, { status: bad.status, queries });

  const tmp = sessionOf(await login("20250001", ACCOUNTS["20250001"].pw, "203.0.113.1"));
  await call("/logout", { method: "POST", cookie: tmp });
  check("로그아웃한 세션은 서버에서도 죽는다", (await call("/api/items", { cookie: tmp })).status === 401);

  for (let i = 0; i < 14; i++) await login("abcd1234", ACCOUNTS.abcd1234.pw, "203.0.113.3");
  const n = rows(`SELECT COUNT(*) n FROM sessions WHERE user_id='abcd1234'`)[0].n;
  check("한 사람의 세션이 끝없이 쌓이지 않는다 (10개까지)", n <= 10, n + "개");
}

// ══ 3. 다른 사이트가 시키는 요청 (CSRF) ════════════════════════════
section("3. 다른 사이트가 시키는 요청 (CSRF)");
{
  await call("/api/items/keep-me", { method: "PUT", cookie: A, body: item("지키는 과제") });
  const alive = async () => (await (await call("/api/items", { cookie: A })).json()).some((i) => i.id === "keep-me");
  const tries = [
    ["다른 사이트의 Origin", { origin: "https://evil.example" }],
    ["Origin: null", { origin: "null" }],
    ["Origin 없이 Sec-Fetch-Site: cross-site", { origin: null, headers: { "sec-fetch-site": "cross-site" } }],
    ["Origin 없이 Sec-Fetch-Site: same-site (옆 서브도메인)", { origin: null, headers: { "sec-fetch-site": "same-site" } }],
    ["출처를 알 수 있는 헤더가 하나도 없음", { origin: null }],
    ["Origin 없이 다른 사이트의 Referer", { origin: null, headers: { referer: "https://evil.example/x" } }],
  ];
  for (const [name, o] of tries) {
    const r = await call("/api/me", { method: "DELETE", cookie: A, ...o });
    check(`${name} → 내 데이터 삭제 요청이 거절된다`, r.status === 403 && await alive(), r.status);
  }
  const form = await call("/api/items/csrf-form", { method: "PUT", cookie: A, body: JSON.stringify(item("폼으로 밀어 넣기")), headers: { "content-type": "text/plain" } });
  check("JSON 이 아닌 형식(폼이 보낼 수 있는 형식)의 쓰기는 안 받는다", form.status === 415, form.status);
  const lg = await login("20250001", ACCOUNTS["20250001"].pw, "203.0.113.1", { origin: "https://evil.example" });
  check("다른 사이트에서 보낸 로그인 양식도 안 받는다", lg.status === 403, lg.status);
  const ok = await call("/api/items/keep-me", { method: "PUT", cookie: A, origin: null, headers: { "sec-fetch-site": "same-origin" }, body: item("지키는 과제") });
  check("(확인) 같은 출처의 정상 요청은 통과한다", ok.status === 204, ok.status);
}

// ══ 4. 남의 것 건드리기 ════════════════════════════════════════════
section("4. 남의 것 건드리기");
{
  await call("/api/items/shared-id", { method: "PUT", cookie: A, body: item("A의 것") });
  await call("/api/items/shared-id", { method: "PUT", cookie: B, body: item("B의 것", { status: "완료" }) });
  await call("/api/items/keep-me", { method: "DELETE", cookie: B });
  await call("/api/items/x?user_id=20250001&uid=20250001", { method: "PUT", cookie: B, body: { ...item("주입"), user_id: "20250001" } });
  const a = await (await call("/api/items", { cookie: A })).json();
  check("B 가 같은 ID 로 저장·삭제하고 학번을 실어 보내도 A 의 것은 그대로",
    a.find((i) => i.id === "shared-id").title === "A의 것" && a.some((i) => i.id === "keep-me") && !a.some((i) => i.title === "주입"));
  const b = await (await call("/api/items?user_id=20250001", { cookie: B })).json();
  check("주소에 A 의 학번을 실어도 B 것만 온다", b.every((i) => i.title !== "A의 것" && i.title !== "지키는 과제"));

  const T = env.VIEW_TOKEN;
  const view = await call("/api/items?t=" + T, { ip: "203.0.113.50" });
  check("(확인) 읽기 전용 링크는 읽기가 된다", view.status === 200);
  const w = await Promise.all([
    call("/api/items/v1?t=" + T, { method: "PUT", body: item("링크로 쓰기"), ip: "203.0.113.50" }),
    call("/api/me?t=" + T, { method: "DELETE", ip: "203.0.113.50" }),
    call("/api/sync?t=" + T, { method: "POST", ip: "203.0.113.50" }),
    call("/logout?t=" + T, { method: "POST", ip: "203.0.113.50" }),
  ]);
  check("읽기 전용 링크로는 쓰기·삭제·동기화가 전부 403", w.slice(0, 3).every((r) => r.status === 403), w.map((r) => r.status).join(","));

  let got = 0;
  for (let i = 0; i < 40; i++) if ((await call("/api/items?t=guess" + i, { ip: "203.0.113.60" })).status === 200) got++;
  const locked = await call("/api/items?t=" + T, { ip: "203.0.113.60" });
  check("읽기 전용 링크의 열쇠를 찍어 보면 그 접속지는 잠긴다", got === 0 && locked.status !== 200, locked.status);
  check("  다른 곳에서 여는 정상 링크는 그대로 된다", (await call("/api/items?t=" + T, { ip: "203.0.113.61" })).status === 200);
  sqlite.exec(`DELETE FROM login_fail`);

  const files = await Promise.all(["/app.html", "/.dev.vars", "/wrangler.toml", "/src/worker.js", "/schema.sql", "/..%2f.dev.vars", "/api/status", "/api/logs"].map((p) => call(p)));
  check("로그인 없이는 화면 파일·설정 파일·API 어느 것도 안 나온다",
    files.every((r) => r.status === 302 || r.status === 401), files.map((r) => r.status).join(","));
}

// ══ 5. 끼워 넣기 (SQL · 스크립트) ═════════════════════════════════
section("5. 끼워 넣기 (SQL · 스크립트)");
{
  const before = rows(`SELECT COUNT(*) n FROM users`)[0].n;
  const sqli = `x'); DROP TABLE users; --`;
  await call("/api/items/sqli-1", { method: "PUT", cookie: A, body: item(sqli, { course: `' OR '1'='1`, note: `"; DELETE FROM items; --` }) });
  await call("/api/items/" + encodeURIComponent(`a' OR '1'='1`), { method: "DELETE", cookie: A });
  await call("/api/logs/" + encodeURIComponent(`2027-01-01' OR '1'='1`), { method: "DELETE", cookie: A });
  await login(`admin'--`, "x", "203.0.113.70");
  const a = await (await call("/api/items", { cookie: A })).json();
  check("SQL 조각을 넣어도 글자 그대로 저장되고 표는 멀쩡하다",
    rows(`SELECT COUNT(*) n FROM users`)[0].n === before && a.some((i) => i.title === sqli) && a.length >= 3, a.length);

  const stored = a.find((i) => i.title === XSS);
  check("(준비) 이캠퍼스 과제 제목에 스크립트가 든 일정이 들어와 있다", !!stored);
  const list = await call("/api/items", { cookie: A });
  check("목록 응답은 JSON 으로만 나간다 (브라우저가 HTML 로 읽지 않는다)",
    /^application\/json/.test(list.headers.get("content-type")) && list.headers.get("x-content-type-options") === "nosniff");
  const pageB = await call("/", { cookie: B });
  const htmlB = await pageB.text();
  check("이름에 따옴표·꺾쇠가 있어도 화면에 그대로 박히지 않는다", !htmlB.includes(ACCOUNTS["20250002"].name) && htmlB.includes("라마&#34;onx=&#39;1"));
  const csp = pageB.headers.get("content-security-policy") || "";
  const scriptSrc = (/script-src ([^;]*)/.exec(csp) || [])[1] || "";
  check("화면의 스크립트는 그 요청의 nonce 가 붙은 것만 돈다", /^'nonce-[A-Za-z0-9+/=]{16,}'$/.test(scriptSrc), scriptSrc);
  const csp2 = (await call("/", { cookie: B })).headers.get("content-security-policy");
  check("nonce 는 요청마다 다르다", csp !== csp2);
  check("바깥에서 불러올 수 있는 것은 글꼴 경로로 못 박혀 있다",
    !/\*/.test(csp) && /default-src 'none'/.test(csp) && !/https:\/\/cdn\.jsdelivr\.net(\s|;|$)/.test(csp), csp);

  const bads = [
    ["날짜 칸에 태그", item("x", { due: `2027-01-10"><script>1</script>` })],
    ["닫히는 날에 태그", item("x", { closes: `"><img src=x>` })],
    ["시각 칸에 글자", item("x", { dueTime: "12:00<b>" })],
    ["모르는 종류", item("x", { kind: `"><svg>` })],
    ["모르는 출처", item("x", { source: "<i>" })],
    ["제목이 글자가 아님", item({ $gt: "" })],
    ["끝없이 긴 제목", item("가".repeat(301))],
  ];
  for (const [name, body] of bads) {
    const r = await call("/api/items/bad-1", { method: "PUT", cookie: A, body });
    check(`${name} → 400`, r.status === 400, r.status);
  }
  const badId = await call("/api/items/" + encodeURIComponent(`"><img src=x onerror=1>`), { method: "PUT", cookie: A, body: item("id 공격") });
  check("항목 ID 에 태그 → 400", badId.status === 400, badId.status);
  const pct = await Promise.all([call("/api/items/%E0%A4%A", { method: "DELETE", cookie: A }), call("/api/logs/%zz", { method: "PUT", cookie: A, body: { memo: "x" } })]);
  check("깨진 % 인코딩은 서버 오류(500)가 아니라 400", pct.every((r) => r.status === 400), pct.map((r) => r.status).join(","));
  await call("/api/logs/2027-01-02", { method: "PUT", cookie: A, body: JSON.parse(`{"__proto__":{"polluted":1},"constructor":{"prototype":{"polluted":1}},"memo":"x"}`) });
  check("__proto__ 를 실어 보내도 서버 객체가 오염되지 않는다", ({}).polluted === undefined);
}

// ══ 6. 자원 고갈 ═══════════════════════════════════════════════════
section("6. 자원 고갈");
{
  const big = "가".repeat(400_000);
  const r1 = await call("/login", { method: "POST", body: new URLSearchParams({ username: "20250001", password: big }) });
  const r2 = await call("/api/items/big-1", { method: "PUT", cookie: A, body: { ...item("큰 것"), extra: big } });
  const r3 = await call("/api/logs/2027-01-03", { method: "PUT", cookie: A, body: { memo: big } });
  check("1MB 짜리 본문은 읽다 말고 413 으로 끊는다", [r1, r2, r3].every((r) => r.status === 413), [r1, r2, r3].map((r) => r.status).join(","));

  let last = 204, made = 0;
  for (let i = 0; i < 3200 && last === 204; i++, made++) last = (await call("/api/items/flood-" + i, { method: "PUT", cookie: B, body: item("채우기 " + i) })).status;
  const n = rows(`SELECT COUNT(*) n FROM items WHERE user_id='20250002'`)[0].n;
  check("한 사람이 일정을 끝없이 밀어 넣을 수 없다 (3000건까지)", n <= 3000 && last !== 204, { n, last });
  const edit = await call("/api/items/flood-1", { method: "PUT", cookie: B, body: item("채우기 1", { status: "완료" }) });
  check("  꽉 찬 뒤에도 있던 항목은 고칠 수 있다", edit.status === 204, edit.status);
  sqlite.exec(`DELETE FROM items WHERE id LIKE 'flood-%'`);

  let lastLog = 204;
  for (let i = 0; i < 450 && lastLog === 204; i++) {
    const d = new Date(Date.UTC(2020, 0, 1 + i)).toISOString().slice(0, 10);
    lastLog = (await call("/api/logs/" + d, { method: "PUT", cookie: B, body: { memo: "x" } })).status;
  }
  const nl = rows(`SELECT COUNT(*) n FROM logs WHERE user_id='20250002'`)[0].n;
  check("하루 계획도 끝없이 쌓을 수 없다 (400일치까지)", nl <= 400 && lastLog !== 204, { nl, lastLog });

  sqlite.exec(`UPDATE users SET lastSyncAt='2026-01-01T00:00:00.000Z'`);
  eca.feeds = 0;
  const syncs = await Promise.all(Array.from({ length: 12 }, () => call("/api/sync", { method: "POST", cookie: A })));
  for (let i = 0; i < 5; i++) await call("/api/sync", { method: "POST", cookie: A });
  check("동기화를 한꺼번에·연달아 눌러 이캠퍼스를 두드리게 할 수 없다", eca.feeds === 1 && syncs.filter((r) => r.status === 200).length === 1, eca.feeds + "번 나감");

  const m = await Promise.all(["PATCH", "OPTIONS"].map((method) => call("/api/items", { method, cookie: A })));
  check("쓰지 않는 요청 방식은 405", m.every((r) => r.status === 405), m.map((r) => r.status).join(","));
}

// ══ 7. 응답 헤더 · 오류 ════════════════════════════════════════════
section("7. 응답 헤더 · 오류");
{
  breakDb = true;
  const boom = await call("/api/items", { cookie: A });
  breakDb = false;
  const text = await boom.text();
  check("서버 오류가 나도 속사정을 밖으로 내보내지 않는다", boom.status === 500 && !/D1_ERROR|secret-internal|at \w+ \(/.test(text), text.slice(0, 80));

  const all = [
    ["화면", await call("/", { cookie: A })], ["로그인 화면", await call("/login")], ["돌려보내기", await call("/")],
    ["401", await call("/api/items")], ["403", await call("/api/me", { method: "DELETE", cookie: A, origin: "https://evil.example" })],
    ["404", await call("/api/nope", { cookie: A })], ["500", boom], ["목록", await call("/api/items", { cookie: A })],
  ];
  const need = ["strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy", "content-security-policy",
    "permissions-policy", "cross-origin-opener-policy", "cross-origin-resource-policy", "cache-control"];
  const missing = all.flatMap(([name, r]) => need.filter((h) => !r.headers.get(h)).map((h) => name + ":" + h));
  check("모든 응답에 보안 헤더가 붙는다", missing.length === 0, missing);
  check("개인 데이터는 어디에도 저장하지 말라고 나간다", all.every(([, r]) => /no-store/.test(r.headers.get("cache-control"))));
  check("다른 사이트가 읽도록 허락하는 헤더(CORS)는 없다", all.every(([, r]) => !r.headers.get("access-control-allow-origin")));
  const pageA = await (await call("/", { cookie: A })).text();
  check("화면에 세션·비밀번호·달력 주소가 실리지 않는다",
    !pageA.includes(A.split("=")[1]) && !pageA.includes("feedsecret") && !pageA.includes(env.VIEW_TOKEN) && !pageA.includes(env.DATA_KEY));
}

console.log(`\n막힘 ${pass} / 뚫림 ${fail}`);
process.exit(fail ? 1 : 0);
