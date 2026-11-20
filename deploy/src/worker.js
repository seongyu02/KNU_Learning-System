/**
 * ALL 캠퍼스(옛 이름 "마감 계기판") — Cloudflare Worker (강남대 학생 여러 명이 각자 쓰는 판)
 *
 * 하는 일
 *   1) 학생이 이캠퍼스 아이디·비밀번호로 로그인한다. 서버는 그 값으로 이캠퍼스에
 *      **한 번** 로그인해서 그 학생의 달력 주소(iCal)만 받아 온다.
 *      비밀번호는 그 요청 안에서만 쓰고 버린다. 어디에도 저장하지 않는다.
 *   2) 달력 주소는 암호화해서 D1 에 두고, 학생마다 따로 일정을 받아 반영한다.
 *      모든 조회·수정은 세션의 user_id 로만 가른다. 화면이 보낸 값은 믿지 않는다.
 *   3) 같은 화면(내과제/웹앱.html)을 서빙한다. 화면은 포크하지 않는다 —
 *      claude.use("db") 와 같은 모양의 어댑터를 주입해서 한 벌로 양쪽에서 쓴다.
 *
 * 비밀값 (wrangler secret put)
 *   DATA_KEY    달력 주소를 암호화하는 임의의 긴 문자열. 바꾸면 전원이 다시 로그인해야 한다
 *   OWNER_ID    (선택) 만든 사람의 학번. 1인용 시절 데이터와 읽기 전용 링크가 이 계정에 붙는다
 *   VIEW_TOKEN  (선택) 채점·공유용 읽기 전용 링크. OWNER_ID 의 화면을 보기만 한다
 */

// 순수 함수는 밖으로 뺀다 — test.mjs 가 실제 피드로 검증한다.
export { h32, idFor, parseIcs, classify, toKstDate, formBody, findIcsUrl, findName, parseUpcoming, courseIds, dueTimeFor };

const KST_OFFSET = 9 * 60 * 60 * 1000;
const COOKIE = "dd_token";      // 읽기 전용 링크
const SESSION = "dd_session";   // 로그인한 학생
const REMEMBER = "dd_id";       // "아이디 저장"을 켠 브라우저에만. 학번뿐이다 — 비밀번호는 어디에도 두지 않는다
const SESSION_DAYS = 30;
const MAX_SESSIONS = 10;        // 한 사람이 동시에 로그인해 둘 수 있는 기기 수
const MAX_ITEMS = 3000;         // 한 사람의 일정. 한 학기 일정은 수십~수백 건이다
const MAX_LOGS = 400;           // 한 사람의 하루 계획(일 수)
const MAX_FEED = 2_000_000;     // 이캠퍼스 달력 한 번의 크기(글자 수)
const ECAMPUS = "https://ecampus.kangnam.ac.kr";
const EXCLUDE_COURSES = ["신입생세미나"]; // 만든 사람(OWNER_ID)이 멘토라 제출물이 없는 과목. 다른 학생에게는 적용하지 않는다

// ── 공통 ───────────────────────────────────────────────────────────

const nfc = (s) => String(s ?? "").normalize("NFC");

/** FNV-1a 32비트 (UTF-8 바이트). 파이썬 쪽 h32() 와 같은 값이 나와야 한다. */
function h32(s) {
  const b = new TextEncoder().encode(nfc(s));
  let h = 0x811c9dc5;
  for (let i = 0; i < b.length; i++) {
    h = (h ^ b[i]) >>> 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

const idFor = (course, title, due) =>
  due.replace(/-/g, "") + "_" + h32(nfc(course) + "|" + nfc(title));

const kstDate = (ms) => new Date(ms + KST_OFFSET).toISOString().slice(0, 10);

// ── iCal 파싱 ──────────────────────────────────────────────────────

const COURSE_RE = /^(.+?)\(\d{4}년도.*?([A-Z]{2}\d{5}).*?\)$/;
const HASH_RE = /^[0-9a-f]{32}$/;

function unescapeIcal(s) {
  // 이캠퍼스는 제목 일부를 NFD(분해형 한글)로 내보낸다. 눈에는 한글이지만
  // 프로그램에게는 자모 낱개라, 여기서 NFC 로 모으지 않으면 같은 과제가 두 개로 갈라진다.
  return nfc(s).replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/g, " ").trim();
}

/** 시각이 붙은 이벤트는 UTC 로 온다. 앞 8자를 그냥 자르면 하루가 당겨진다. */
function toKstDate(raw, dateOnly) {
  if (!raw) return "";
  if (dateOnly) return raw.slice(0, 8);
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(raw);
  if (!m) return raw.slice(0, 8);
  const ms = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  return m[7] === "Z" ? kstDate(ms).replace(/-/g, "") : raw.slice(0, 8);
}

function parseIcs(raw) {
  const text = raw.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
  const out = [];
  for (const block of text.split("BEGIN:VEVENT").slice(1)) {
    const body = block.split("END:VEVENT")[0];
    const ev = {};
    for (const line of body.trim().split("\n")) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const key = line.slice(0, i);
      ev[key.split(";")[0]] = line.slice(i + 1);
      ev["params:" + key.split(";")[0]] = key;
    }
    out.push(ev);
  }
  return out;
}

/**
 * 네 갈래로 나눈다 — 2026-09-24 실제 피드 18건을 눈으로 확인하고 세운 규칙.
 *   · 과목 칸이 32자리 16진수        → 비교과·외부특강
 *   · 제외 과목                      → 버린다
 *   · DTSTART 에 시각이 없다          → 과제 마감
 *   · DTSTART 에 시각이 있다          → 강의차시(동영상·열람기간)
 *
 * 강의차시의 DTSTART 는 **열리는 때**, DTEND 는 **닫히는 때**다. 마감이 아니다.
 * due 에는 열리는 날을 그대로 둔다(ID 가 due 로 만들어지므로 바꾸면 같은 강의가 둘로 갈라진다).
 * 닫히는 날은 closes 에 따로 싣는다. 이걸 버렸더니 막 열린 강의가 "지남 2일"로 떴다.
 */
function classify(ev, exclude) {
  // map 의 둘째 인자(순번)가 들어와도 기본값을 쓴다.
  const skip = Array.isArray(exclude) ? exclude : EXCLUDE_COURSES;
  const cat = unescapeIcal(ev.CATEGORIES || "");
  const title = unescapeIcal(ev.SUMMARY || "(제목없음)");
  const rawStart = ev.DTSTART || "";
  const params = ev["params:DTSTART"] || "";

  if (HASH_RE.test(cat)) return null; // 비교과

  const m = COURSE_RE.exec(cat);
  const course = m ? m[1] : cat || "(과목미상)";
  if (skip.some((x) => course.includes(x))) return null;

  const dateOnly = params.includes("VALUE=DATE") || rawStart.replace(/Z$/, "").length === 8;
  const d8 = toKstDate(rawStart, dateOnly);
  if (!/^\d{8}$/.test(d8)) return null;

  const dash = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  let closes = null;
  if (!dateOnly && ev.DTEND) {
    const e8 = toKstDate(ev.DTEND, false);
    if (/^\d{8}$/.test(e8)) closes = dash(e8);
  }

  return {
    title,
    course,
    kind: dateOnly ? "과제" : "강의",
    due: dash(d8),
    closes,
    // 이캠퍼스의 일정 번호. 달력 화면의 event_<번호> 와 같다 — 정확한 마감 시각을 맞춰 넣을 때 쓴다.
    uid: (/^(\d+)@/.exec(ev.UID || "") || [])[1] || null,
  };
}

// ── 공통 (HTTP · 암호) ─────────────────────────────────────────────

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8" } });

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const sha256 = async (s) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

/** 비밀값끼리 견줄 때 쓴다. 글자를 앞에서부터 견주면 걸린 시간으로 몇 글자까지 맞았는지 샌다. */
const same = async (a, b) => (await sha256("a:" + a)) === (await sha256("a:" + b));

/**
 * 본문을 max 바이트까지만 읽는다. 넘으면 null — 끝까지 받아 놓고 거르면 이미 메모리를 다 쓴 뒤다.
 * Content-Length 는 보낸 쪽이 적는 값이라 믿지 않고, 읽으면서 센다.
 */
async function readBody(req, max) {
  if (Number(req.headers.get("content-length") || 0) > max) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) { await reader.cancel().catch(() => {}); return null; }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.length; }
  return new TextDecoder().decode(all);
}

const tooBig = () => json({ ok: false, message: "보낸 내용이 너무 큽니다." }, 413);

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.get("cookie") || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

/**
 * 달력 주소는 그 학생의 일정 전체를 읽는 열쇠다. DB 가 새도 바로 못 쓰게 AES-GCM 으로 잠근다.
 * 열쇠(DATA_KEY)는 wrangler secret 에만 있다.
 */
async function dataKey(env) {
  const raw = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.DATA_KEY));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function seal(env, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await dataKey(env), new TextEncoder().encode(text));
  return hex(iv) + "." + hex(ct);
}

async function unseal(env, sealed) {
  const [iv, ct] = String(sealed).split(".").map((h) => Uint8Array.from(h.match(/../g) || [], (x) => parseInt(x, 16)));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await dataKey(env), ct);
  return new TextDecoder().decode(pt);
}

// ── 이캠퍼스 로그인 ────────────────────────────────────────────────
//
// 학교가 외부 서비스용 SSO·API 를 열어 주지 않아서, 학생이 브라우저로 하는 일을
// 서버가 한 번 대신 한다: 로그인 → 달력 내보내기 → 주소 받기 → 로그아웃.
// 남기는 것은 달력 주소뿐이다. 비밀번호와 이캠퍼스 세션은 이 함수가 끝나면 사라진다.

const UA = "Mozilla/5.0 (compatible; deadline-dashboard)";

/** Worker 의 fetch 에는 쿠키 통이 없다. 직접 들고 다닌다. */
async function hop(jar, url, init = {}) {
  const res = await fetch(url, {
    ...init,
    redirect: "manual",
    headers: { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), "user-agent": UA },
  });
  for (const c of res.headers.getSetCookie()) {
    const kv = c.split(";")[0];
    const i = kv.indexOf("=");
    if (i > 0) jar[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
  }
  return res;
}

async function follow(jar, url, init) {
  let res = await hop(jar, url, init);
  for (let i = 0; i < 5 && res.status >= 300 && res.status < 400; i++) {
    const loc = res.headers.get("location");
    if (!loc) break;
    const next = new URL(loc, url);
    if (next.origin !== ECAMPUS) break; // 쿠키를 이캠퍼스 밖으로 들고 나가지 않는다
    url = next.href;
    res = await hop(jar, url);
  }
  return res;
}

function inputs(html) {
  const out = [];
  for (const tag of html.match(/<input\b[^>]*>/gi) || []) {
    const attr = (n) => {
      const m = new RegExp(`\\s${n}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(tag);
      return m ? (m[1] ?? m[2]).replace(/&amp;/g, "&").replace(/&quot;/g, '"') : undefined;
    };
    const name = attr("name");
    if (name) out.push({ name, type: (attr("type") || "text").toLowerCase(), value: attr("value") });
  }
  return out;
}

/**
 * 달력 내보내기 폼을 "모든 이벤트 + 최근·다가오는 일정"으로 채운다.
 * 무들 판에 따라 칸 이름이 다르다(events[exportevents] / preset_what). 페이지에 있는
 * 이름을 그대로 따르고, 못 찾으면 두 가지 이름을 다 보낸다 — 모르는 칸은 무들이 무시한다.
 */
function formBody(html) {
  const body = new URLSearchParams();
  const radios = {};
  for (const i of inputs(html)) {
    if (i.type === "hidden") body.set(i.name, i.value ?? "");
    else if (i.type === "radio") (radios[i.name] ||= []).push(i.value ?? "");
  }
  for (const [name, values] of Object.entries(radios)) {
    body.set(name, ["all", "recentupcoming"].find((w) => values.includes(w)) ?? values[values.length - 1]);
  }
  const fallback = {
    "events[exportevents]": "all", "period[timeperiod]": "recentupcoming",
    preset_what: "all", preset_time: "recentupcoming",
  };
  if (!Object.keys(radios).length) for (const [k, v] of Object.entries(fallback)) body.set(k, v);
  body.set("generateurl", "1");
  return body;
}

function findIcsUrl(html) {
  const m = /https?:\/\/[^\s"'<>]*export_execute\.php\?[^\s"'<>]*authtoken=[^\s"'<>]+/.exec(html);
  if (!m) return null;
  const u = m[0].replace(/&amp;/g, "&");
  try { return new URL(u).origin === ECAMPUS ? u : null; } catch { return null; }
}

/** 이캠퍼스 화면 위쪽 "내정보"에 적힌 이름. 못 찾으면 null — 그때는 학번을 보여 준다. */
function findName(html) {
  const m = /class="user-info-picture"[\s\S]{0,400}?<h4[^>]*>([^<]{1,40})<\/h4>/.exec(html) ||
    /<li[^>]*\bclass="user_department\b[^>]*>([^<]{1,40})<\/li>/.exec(html);
  return (m && nfc(m[1]).replace(/&[#\w]+;/g, " ").trim()) || null;
}

// ── 정확한 마감 시각 ───────────────────────────────────────────────
//
// 달력 내보내기(iCal)는 과제에 **날짜만** 준다. 낮 12시 마감인 과제가 23:59 로 보이면
// 12시간을 속는다(2026-11-13 머신러닝 과제2 로 실제 겪었다). 시각은 로그인한 뒤의
// 달력 화면에만 있어서, 로그인한 김에 그 화면을 읽어 온다.

const CLOCK = /(오전|오후|AM|PM)?\s*(\d{1,2}):(\d{2})/gi;
const minutes = (ampm, hh, mm) =>
  (Number(hh) % (ampm ? 12 : 24) + (/오후|PM/i.test(ampm || "") ? 12 : 0)) * 60 + Number(mm);

/**
 * 달력 화면(다가오는 일정 · 하루 보기) → { 일정번호: [초 단위 시각, …] }.
 * 기간이 있는 일정은 시작·끝 둘 다 든다.
 *
 * 다가오는 일정 화면은 날짜 링크(view=day&time=…)에 시각이 그대로 실려 있다. 링크가 자정만
 * 가리키는 판일 때를 대비해, 옆에 적힌 HH:MM 과 다르면 적힌 쪽을 따른다.
 * 하루 보기 화면은 날짜 없이 "11:50" 만 적는다. 그때는 그 날의 자정(dayStart)에 더한다.
 */
function parseUpcoming(html, dayStart) {
  const out = {};
  html = String(html);
  // 일정이 없는 날이 대부분이다. 그런 화면은 훑지 않는다(무료 플랜은 CPU 시간이 짧다).
  const from = html.indexOf('id="event_');
  if (from < 0) return out;
  for (const block of html.slice(Math.max(0, from - 500)).split(/<div\b(?=[^>]*\bid="event_\d+")/).slice(1)) {
    const id = /^[^>]*\bid="event_(\d+)"/.exec(block);
    const span = /<span[^>]*\bclass="date\b[^>]*>([\s\S]*?)<\/span>/.exec(block);
    if (!id || !span) continue;
    const times = [];
    const re = new RegExp(/[?&](?:amp;)?time=(\d+)[^>]*>[^<]*<\/a>\s*,?\s*/.source + CLOCK.source, "gi");
    for (let m; (m = re.exec(span[1])); ) {
      let ts = Number(m[1]);
      const shown = minutes(m[2], m[3], m[4]);
      const kst = Math.floor(((ts * 1000 + KST_OFFSET) % 86400e3) / 60e3);
      if (kst !== shown) ts += (shown - kst) * 60;
      times.push(ts);
    }
    if (!times.length && dayStart) {
      for (const m of span[1].replace(/<[^>]+>/g, " ").matchAll(CLOCK)) times.push(dayStart + minutes(m[1], m[2], m[3]) * 60);
    }
    if (times.length) out[id[1]] = times;
  }
  return out;
}

/** 과목 고르는 칸의 과목 번호들. "모든 강좌"(1)는 뺀다. */
function courseIds(html) {
  const sel = /<select[^>]*\bname="course"[^>]*>([\s\S]*?)<\/select>/.exec(String(html));
  const ids = [...(sel ? sel[1] : "").matchAll(/<option[^>]*\bvalue="(\d+)"/g)].map((m) => m[1]);
  return [...new Set(ids)].filter((id) => id !== "1");
}

/**
 * 날짜(due)와 정확한 시각을 "HH:MM" 으로. 화면이 날짜는 그대로 두고 시각으로 표현하므로
 * 자정은 "24:00", 다음 날 새벽은 "32:00" 처럼 24 를 넘겨 적는다. iCal 의 날짜가 UTC 기준이라
 * 자정~오전 9시 마감은 하루 앞 날짜로 온다. 날짜와 동떨어진 시각이면 null — 다른 일정이다.
 */
function dueTimeFor(due, times) {
  const base = Date.parse(due + "T00:00:00+09:00") / 1000;
  for (const ts of times || []) {
    const min = Math.floor((ts - base) / 60);
    if (min >= 0 && min < 33 * 60) {
      return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");
    }
  }
  return null;
}

const TIME_FETCHES = 30; // 무료 플랜은 호출 하나에 바깥 요청 50번까지다. 로그인·동기화 몫을 남긴다

/**
 * 과제가 걸린 날의 "하루 보기" 화면을 열어 시각을 읽는다.
 *
 * 다가오는 일정 화면만으로는 안 된다 — 전체는 10건에서 잘리고("졸업선배 진로영상" 10건이
 * 다 차지했다), 과목별로 봐도 며칠 안에 닥친 것만 나온다(6일·9일 남은 과제가 "계획된 일정이
 * 없습니다"였다). 그 화면은 하루 보기로 못 찾은 것이 있을 때만 마지막으로 본다.
 * 실패해도 로그인은 막지 않는다 — 시각만 못 얻을 뿐이다.
 *
 * debug: 화면 모양이 바뀌었을 때 `wrangler tail` 로 원인을 보려고 둔다. 일정 번호와 화면에
 * 적힌 날짜 글자만 찍는다 — 주소·세션·본문은 찍지 않는다.
 */
async function exactTimes(jar, icsUrl, debug) {
  const out = {};
  let left = TIME_FETCHES;
  const get = async (path) => {
    if (left-- <= 0) return "";
    try { return await (await hop(jar, ECAMPUS + path)).text(); } catch { return ""; }
  };
  const take = (found) => { for (const [id, ts] of Object.entries(found)) out[id] = (out[id] || []).concat(ts); };
  const noon = (d) => Date.parse(d + "T12:00:00+09:00");
  const uniq = (a) => [...new Set(a)];
  try {
    left--;
    const feed = await (await fetch(icsUrl, { cf: { cacheTtl: 0 } })).text();
    const since = kstDate(Date.now() - 86400e3);
    const wanted = parseIcs(feed).map((ev) => classify(ev, []))
      .filter((e) => e && e.kind === "과제" && e.uid && e.due >= since);
    const missing = () => wanted.filter((e) => !dueTimeFor(e.due, out[e.uid]));

    const days = async (dates) => {
      const pages = await Promise.all(dates.map((d) => get(`/calendar/view.php?view=day&time=${noon(d) / 1000}`)));
      pages.forEach((page, i) => {
        take(parseUpcoming(page, Date.parse(dates[i] + "T00:00:00+09:00") / 1000));
        if (debug) console.log("day", dates[i], "bytes", page.length, "events", (page.match(/\bid="event_\d+"/g) || []).length,
          JSON.stringify(wanted.filter((e) => page.includes(`id="event_${e.uid}"`)).map((e) =>
            [e.uid, ((new RegExp(`id="event_${e.uid}"[\\s\\S]*?<span[^>]*class="date[^>]*>([\\s\\S]*?)</span>`).exec(page) || [])[1] || "")
              .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()])));
      });
    };
    await days(uniq(wanted.map((e) => e.due)).sort().slice(0, 12));
    // 자정~오전 9시 마감은 iCal 날짜의 다음 날 화면에 있다.
    await days(uniq(missing().map((e) => kstDate(noon(e.due) + 86400e3))).sort().slice(0, 8));

    if (missing().length) {
      const all = await get("/calendar/view.php?view=upcoming");
      take(parseUpcoming(all));
      const pages = await Promise.all(courseIds(all).map((id) => get(`/calendar/view.php?view=upcoming&course=${id}`)));
      for (const page of pages) take(parseUpcoming(page));
    }
    if (debug) console.log("times", JSON.stringify(wanted.map((e) => [e.uid, e.due, dueTimeFor(e.due, out[e.uid])])), "fetches left", left);
  } catch (err) {
    if (debug) console.log("times failed", String(err));
  }
  return out;
}

/** → { ok:true, ics, times, name } | { ok:false, reason: "bad" | "blocked" | "export" | "down" } */
async function ecampusLogin(username, password, debug) {
  const jar = {};
  try {
    const first = await follow(jar, ECAMPUS + "/login.php");
    const body = new URLSearchParams({ username, password });
    const token = inputs(await first.text()).find((i) => i.name === "logintoken");
    if (token) body.set("logintoken", token.value ?? "");
    const posted = await hop(jar, ECAMPUS + "/login/index.php", { method: "POST", body });
    // 틀리면 이캠퍼스는 /login.php?errorcode=3 으로 돌려보낸다.
    if (/\/login\.php/.test(posted.headers.get("location") || "")) return { ok: false, reason: "bad" };

    const page = await hop(jar, ECAMPUS + "/calendar/export.php");
    if (page.status >= 300 && page.status < 400) {
      const loc = page.headers.get("location") || "";
      return { ok: false, reason: /\/login/.test(loc) ? "bad" : "blocked" };
    }
    if (!page.ok) return { ok: false, reason: "down" };
    const html = await page.text();
    // 이 페이지는 로그인하지 않아도 200 으로 열린다. 본문의 표식으로 가른다.
    if (/\bnotloggedin\b/.test(html)) return { ok: false, reason: "bad" };

    const made = await follow(jar, ECAMPUS + "/calendar/export.php", { method: "POST", body: formBody(html) });
    const ics = findIcsUrl(await made.text());
    // 이캠퍼스는 로그인하지 않은 방문자에게도 userid=0 짜리 빈 주소를 내준다 — 실제로 이걸로
    // 아무 아이디나 통과됐다. 진짜 계정의 주소만 받는다(0 = 비로그인, 1 = 손님).
    if (ics && !(Number(new URL(ics).searchParams.get("userid")) > 1)) return { ok: false, reason: "bad" };

    const times = ics ? await exactTimes(jar, ics, debug) : {};

    // 우리가 연 이캠퍼스 세션은 닫고 나온다. 학생이 따로 열어 둔 세션은 건드리지 않는다.
    const sesskey = /"sesskey":"(\w+)"/.exec(html) || /name="sesskey"[^>]*value="(\w+)"/.exec(html);
    if (sesskey) await hop(jar, `${ECAMPUS}/login/logout.php?sesskey=${sesskey[1]}`).catch(() => {});

    return ics ? { ok: true, ics, times, name: findName(html) } : { ok: false, reason: "export" };
  } catch {
    return { ok: false, reason: "down" };
  }
}

// ── 찍어 보기 막기 ─────────────────────────────────────────────────

const WINDOW_MS = 10 * 60 * 1000;
// 열쇠의 첫 글자별 한도 [10분, 하루]. u = 아이디, i = 접속한 곳, t = 읽기 전용 링크의 열쇠.
// 하루 한도가 없으면 10분에 4번씩 천천히 찍는 것을 못 막는다.
// i 가 넉넉한 것은 학교 와이파이처럼 여러 학생이 한 주소로 나오는 곳이 있어서다.
const LIMITS = { u: [5, 20], i: [20, 200], t: [10, 100] };

/** IPv6 는 한 사람이 뒷자리 절반(/64)을 통째로 쓴다. 뒷자리를 바꿔 가며 세는 것을 피하지 못하게 앞 절반으로 묶는다. */
function ipKey(ip) {
  ip = String(ip || "unknown").toLowerCase();
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.split("::");
  const a = head ? head.split(":") : [], b = tail ? tail.split(":") : [];
  const full = ip.includes("::") ? [...a, ...Array(Math.max(0, 8 - a.length - b.length)).fill("0"), ...b] : a;
  return full.slice(0, 4).map((h) => h.replace(/^0+(?=.)/, "")).join(":") + "::/64";
}

const iso = (ms) => new Date(ms).toISOString();

async function overLimit(env, keys, now, self) {
  const r = await env.DB.prepare(
    `SELECT key, SUM(at>?) AS recent, COUNT(*) AS day FROM login_fail
     WHERE at>? AND key IN (${keys.map(() => "?").join(",")}) GROUP BY key`
  ).bind(iso(now - WINDOW_MS), iso(now - 86400e3), ...keys).all();
  return (r.results || []).some((row) => {
    const [short, long] = LIMITS[row.key[0]];
    return row.recent - self >= short || row.day - self >= long;
  });
}

/**
 * 시도를 **먼저 적고 나서** 센다. 세고 나서 적었더니 한꺼번에 쏜 40번이 전부 "아직 5번 전"으로
 * 통과했다(security.test.mjs 로 확인). 한도를 넘었으면 방금 적은 것은 지운다 — 잠긴 동안
 * 두드린다고 잠금이 길어지면 남의 아이디를 계속 잠가 둘 수 있다.
 * → { locked, forget() }  forget 은 이 시도를 없던 일로 한다(틀린 비밀번호가 아니었을 때).
 */
async function attempt(env, keys) {
  const now = Date.now(), at = iso(now);
  await env.DB.batch(keys.map((k) => env.DB.prepare(`INSERT INTO login_fail (key,at) VALUES (?,?)`).bind(k, at)));
  const forget = () => env.DB.batch(keys.map((k) => env.DB.prepare(
    `DELETE FROM login_fail WHERE rowid IN (SELECT rowid FROM login_fail WHERE key=? AND at=? LIMIT 1)`).bind(k, at)));
  const locked = await overLimit(env, keys, now, 1);
  if (locked) await forget();
  return { locked, forget };
}

const LOGIN_ERRORS = {
  bad: ["아이디 또는 비밀번호가 맞지 않습니다.", 401],
  blocked: ["이캠퍼스가 다른 안내(약관 동의·비밀번호 변경 등)를 먼저 요구합니다. 이캠퍼스에 직접 한 번 로그인한 뒤 다시 시도해 주세요.", 502],
  export: ["로그인은 됐지만 이캠퍼스에서 달력 주소를 받지 못했습니다. 잠시 뒤 다시 시도해 주세요.", 502],
  down: ["이캠퍼스에 연결하지 못했습니다. 잠시 뒤 다시 시도해 주세요.", 502],
};

// ── 동기화 ─────────────────────────────────────────────────────────

/**
 * user: { id, ics(잠긴 달력 주소) }
 * times: 로그인 때만 온다(exactTimes). 없으면 마감 시각은 건드리지 않는다.
 */
async function syncUser(env, user, times) {
  const at = new Date().toISOString();
  const fail = async (message) => {
    await log(env, user.id, at, 0, 0, 0, message);
    return { ok: false, message };
  };
  // 시작할 때 찍는다. 끝날 때 찍으면 화면이 20초마다 물어보는 동안 같은 동기화가 겹쳐 돈다.
  await env.DB.prepare(`UPDATE users SET lastSyncAt=? WHERE id=?`).bind(at, user.id).run();

  let icsUrl;
  try {
    icsUrl = await unseal(env, user.ics);
    if (new URL(icsUrl).origin !== ECAMPUS) throw new Error("origin");
  } catch {
    return fail("저장된 달력 주소를 읽지 못했습니다. 로그아웃한 뒤 다시 로그인해 주세요");
  }

  let res;
  try {
    res = await fetch(icsUrl, { cf: { cacheTtl: 0 } });
  } catch {
    return fail("이캠퍼스에 연결하지 못했습니다");
  }
  const text = res.ok ? await res.text() : "";
  if (text.length > MAX_FEED) return fail("이캠퍼스 달력이 너무 커서 받지 않았습니다");
  if (!text.includes("BEGIN:VCALENDAR")) {
    // 이캠퍼스 비밀번호를 바꾸면 달력 주소도 같이 죽는다. 조용히 넘어가면 며칠 뒤에야 알아차린다.
    return fail(`이캠퍼스가 일정을 주지 않습니다(HTTP ${res.status}). 로그아웃한 뒤 다시 로그인해 주세요`);
  }

  const exclude = user.id === env.OWNER_ID ? EXCLUDE_COURSES : [];
  const events = parseIcs(text).map((ev) => classify(ev, exclude)).filter(Boolean);

  const had = await env.DB.prepare(`SELECT id, closes, dueTime FROM items WHERE user_id=?`).bind(user.id).all();
  const have = new Map((had.results || []).map((r) => [r.id, r.closes]));
  const haveTime = new Map((had.results || []).map((r) => [r.id, r.dueTime]));
  const stmts = [];
  let added = 0, timed = 0, soon = 0;
  const since = kstDate(Date.now() - 86400e3);

  for (const e of events) {
    const id = idFor(e.course, e.title, e.due);
    const dueTime = times && e.kind === "과제" && e.uid ? dueTimeFor(e.due, times[e.uid]) : null;
    if (e.kind === "과제" && e.due >= since) { soon++; if (dueTime) timed++; }
    // 이미 있으면 건드리지 않는다. 사람이 넣은 예상소요·완료표시를 덮으면 안 된다.
    if (!have.has(id)) {
      if (have.size >= MAX_ITEMS) continue;
      // ID 는 온전한 제목으로 만들고(파이썬 쪽과 같아야 한다), 담을 때만 화면이 받는 길이로 자른다.
      stmts.push(env.DB.prepare(
        `INSERT OR IGNORE INTO items (user_id,id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt)
         VALUES (?,?,?,?,?,?,?,?,NULL,'미착수','자동','',?)`
      ).bind(user.id, id, e.title.slice(0, 300), e.course.slice(0, 100), e.kind, e.due, dueTime, e.closes, at));
      have.set(id, e.closes);
      haveTime.set(id, dueTime);
      added++;
      continue;
    }
    // 닫히는 날과 마감 시각은 이캠퍼스가 주인인 값이라 따라간다. 사람이 고친 칸은 건드리지 않는다.
    if (e.closes && have.get(id) !== e.closes) {
      stmts.push(env.DB.prepare(`UPDATE items SET closes=? WHERE user_id=? AND id=?`).bind(e.closes, user.id, id));
      have.set(id, e.closes);
    }
    if (dueTime && haveTime.get(id) !== dueTime) {
      stmts.push(env.DB.prepare(`UPDATE items SET dueTime=? WHERE user_id=? AND id=?`).bind(dueTime, user.id, id));
      haveTime.set(id, dueTime);
    }
  }
  if (stmts.length) await env.DB.batch(stmts);

  await log(env, user.id, at, 1, events.length, added, times ? `마감 시각 ${timed}/${soon}건 확인` : "");
  return { ok: true, found: events.length, added };
}

const log = (env, userId, at, ok, found, added, message) =>
  env.DB.prepare(`INSERT OR REPLACE INTO sync_log (user_id,at,ok,found,added,message) VALUES (?,?,?,?,?,?)`)
    .bind(userId, at, ok, found, added, message).run().catch(() => {});

const STALE_MS = 6 * 60 * 60 * 1000; // 화면을 열었을 때 이보다 오래됐으면 뒤에서 당겨온다
const CRON_USERS = 5;                // 크론 한 번에 도는 인원. 무료 플랜의 호출당 한도 안에 머문다
const SYNC_GAP_MS = 30 * 1000;       // '지금 동기화'를 다시 받아 주는 간격

/** 크론. 가장 오래 안 돈 학생부터 몇 명씩 돈다. 자주 여는 학생은 화면이 알아서 당겨온다. */
async function sweep(env) {
  const now = Date.now();
  const iso = (ms) => new Date(ms).toISOString();
  await env.DB.batch([
    env.DB.prepare(`DELETE FROM sessions WHERE expires<?`).bind(iso(now)),
    env.DB.prepare(`DELETE FROM login_fail WHERE at<?`).bind(iso(now - 86400e3)),
    env.DB.prepare(`DELETE FROM sync_log WHERE at<?`).bind(iso(now - 30 * 86400e3)),
  ]);
  const r = await env.DB.prepare(`SELECT id, ics FROM users ORDER BY lastSyncAt LIMIT ?`).bind(CRON_USERS).all();
  for (const u of r.results || []) await syncUser(env, u).catch(() => {});
}

// ── 누구인가 ───────────────────────────────────────────────────────

/**
 *   로그인한 학생   admin — 자기 것만 보고 고친다
 *   VIEW_TOKEN     view  — OWNER_ID 의 화면을 보기만. 체크·추가·삭제·동기화가 전부 막힌다
 *
 * user_id 는 여기서만 정해진다. 주소나 본문에 실려 온 값으로 남의 데이터를 열 수 없다.
 */
async function whoIs(req, env) {
  const cookies = parseCookies(req);
  // 우리가 내준 세션은 16진수 64자다. 모양이 다르면 DB 를 열어 볼 것도 없다.
  if (/^[0-9a-f]{64}$/.test(cookies[SESSION] || "")) {
    const row = await env.DB.prepare(
      `SELECT u.id, u.ics, u.lastSyncAt, u.name, s.expires FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id=? AND s.expires>?`
    ).bind(await sha256(cookies[SESSION]), new Date().toISOString()).first();
    if (row) return { level: "admin", user: row };
  }
  // 읽기 전용 링크는 쿠키와 주소의 ?t= 둘 다 본다 — 쿠키만 받으면 브라우저 설정 하나에 막힌다.
  const q = new URL(req.url).searchParams.get("t");
  const given = [q, cookies[COOKIE]].filter(Boolean).map((t) => t.slice(0, 200));
  if (!env.VIEW_TOKEN || !env.OWNER_ID || !given.length) return null;

  // 링크의 열쇠도 찍어 볼 수 있다. 틀린 것을 세고, 많이 틀린 곳에서는 맞는 열쇠도 받지 않는다.
  const key = ["t:" + ipKey(req.headers.get("cf-connecting-ip"))];
  let right = false;
  for (const t of given) if (await same(t, env.VIEW_TOKEN)) right = true;
  if (!right) {
    await attempt(env, key);
    return null;
  }
  if (await overLimit(env, key, Date.now(), 0)) return null;
  return { level: "view", user: { id: env.OWNER_ID } };
}

const cookie = (name, value, maxAge) =>
  `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
const sessionCookie = (value, maxAge) => cookie(SESSION, value, maxAge);

const readOnly = (msg) =>
  json({ ok: false, message: msg || "읽기 전용 링크입니다. 고칠 수 없습니다." }, 403);

// ── 로그인 화면 ────────────────────────────────────────────────────

// 화면(내과제/웹앱.html)의 무대와 같은 생김새다 — 어두운 바탕에 필름 입자, 얇고 큰 글자, 직각 칸, 가는 선.
// 색 값은 그쪽 무대 토큰(--st, --st-ink, --st-2, --st-3, --ember)을 옮겨 온 것이다. 그쪽을 고치면 여기도 맞춘다.
// 다이얼은 지금 시각(한국 시각)을 가리킨다(바깥부터 초·분·시간, 안쪽 고리는 하루에 한 바퀴). 주황은 로그인이 틀렸을 때만 쓴다.
const loginPage = (message, username, remember, nonce) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#121214">
<title>ALL 캠퍼스 — 로그인</title>
<link rel="stylesheet" href="${FONT_CDN}dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@200..600&amp;display=swap">
<style>
:root{color-scheme:dark;--bg:#121214;--ink:#f3f1ec;--ink-2:#bcb9b2;--ink-3:#918e87;--ctl:#74736e;--line:rgba(243,241,236,.16);--ember:#ff7a3d;--gut:20px}
@media(min-width:640px){:root{--gut:32px}}
@media(min-width:900px){:root{--gut:40px}}
@media(min-width:1280px){:root{--gut:48px}}
@media(min-width:1440px){:root{--gut:64px}}
@media(min-width:1680px){:root{--gut:96px}}
*{box-sizing:border-box}
html{background:var(--bg)}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;
  font-size:15px;line-height:1.6;-webkit-text-size-adjust:100%;word-break:keep-all;-webkit-font-smoothing:antialiased}
.num{font-family:Geist,"Pretendard Variable",Pretendard,sans-serif;font-variant-numeric:tabular-nums}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
::selection{background:var(--ink);color:var(--bg)}
main{position:relative;isolation:isolate;overflow:hidden;display:flex;min-height:100vh;min-height:100dvh}
main::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .13 0 0 0 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E")}
.in{display:flex;flex-direction:column;flex:1;min-width:0;max-width:1560px;margin:0 auto;padding:0 var(--gut);container:stage/inline-size}
.top{display:flex;align-items:center;min-height:64px;padding-top:24px}
.brand{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;line-height:24px;letter-spacing:-.01em}
.brand i{position:relative;flex:none;width:20px;height:20px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);animation:orbit 12s linear infinite}
.brand i::after{content:"";position:absolute;left:50%;top:-2px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 2px var(--bg)}
.mid{position:relative;flex:1;display:grid;grid-template-columns:minmax(0,1fr);align-items:start;padding:32px 0 48px}
.copy{position:relative;z-index:1;min-width:0}
.state{display:flex;align-items:center;gap:12px;margin:0;font-size:13px;font-weight:500;line-height:20px;color:var(--ink-2)}
.state::before{content:"";flex:none;width:24px;height:1px;background:currentColor}
h1{max-width:14em;margin:16px 0 0;font-size:clamp(28px,3.6vw,52px);font-weight:300;line-height:1.22;letter-spacing:-.035em}
/* 구절마다 한 덩이로 줄을 바꾸고, 덩이가 칸보다 길면 낱말 하나만 떨어지지 않게 고르게 나눈다. */
h1 span{display:inline-block;text-wrap:balance}
.err{max-width:400px;margin:32px 0 0;padding-left:16px;border-left:2px solid var(--ember);font-size:14px;line-height:24px;color:var(--ember);text-wrap:pretty}
form{max-width:400px;margin:40px 0 0}
.err+form{margin-top:24px}
label{display:block;font-size:13px;font-weight:500;line-height:20px;color:var(--ink-2)}
/* 16px 보다 작으면 아이폰이 입력할 때 화면을 확대한다. */
#u,#p{display:block;width:100%;height:48px;margin:8px 0 0;padding:0 16px;border:1px solid var(--ctl);border-radius:0;background:transparent;color:var(--ink);
  font:inherit;font-size:16px;transition:border-color .15s}
#u{margin-bottom:16px}
#u:hover,#p:hover{border-color:var(--ink-2)}
#u:focus,#p:focus{outline:1px solid var(--ink);outline-offset:0;border-color:var(--ink)}
/* 브라우저가 채워 넣은 칸에 깔리는 푸른 바탕을 무대 색으로 덮는다(#212123 은 입자가 얹힌 무대를 잰 평균 색이다). */
#u:-webkit-autofill,#p:-webkit-autofill{-webkit-text-fill-color:var(--ink);caret-color:var(--ink);box-shadow:0 0 0 48px #212123 inset}
.keep{display:inline-flex;align-items:center;gap:12px;min-height:44px;margin-top:8px;font-size:14px;font-weight:400;cursor:pointer}
.keep input{appearance:none;-webkit-appearance:none;position:relative;flex:none;width:20px;height:20px;margin:0;border:1px solid var(--ctl);border-radius:0;
  background:transparent;cursor:pointer;transition:background-color .15s,border-color .15s}
.keep:hover input{border-color:var(--ink)}
.keep input:checked{background:var(--ink);border-color:var(--ink)}
.keep input:checked::after{content:"";position:absolute;left:6px;top:2px;width:6px;height:10px;border:solid var(--bg);border-width:0 2px 2px 0;transform:rotate(42deg)}
button{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;margin-top:12px;padding:0 20px;border:1px solid var(--ink);border-radius:0;
  background:var(--ink);color:var(--bg);font:inherit;font-weight:600;cursor:pointer;transition:background-color .15s,color .15s}
button::after{content:"";flex:none;width:8px;height:8px;margin-right:2px;border:solid currentColor;border-width:1.5px 1.5px 0 0;transform:rotate(45deg);transition:transform .2s}
button:hover:not([disabled]){background:transparent;color:var(--ink)}
button:hover:not([disabled])::after{transform:translateX(4px) rotate(45deg)}
/* 이캠퍼스에 물어보는 몇 초 동안은 꺾쇠 자리에서 고리가 돈다. */
button[disabled]{cursor:wait;opacity:.6}
button[disabled]::after{width:14px;height:14px;margin:0;border-width:1.5px;border-color:currentColor currentColor currentColor transparent;border-radius:50%;animation:orbit .8s linear infinite}

/* 궤도 다이얼. 좁은 화면에서는 글 뒤로 떠오르는 배경이고, 넓으면 오른쪽에 계기로 선다(화면의 무대와 같다).
   점은 지금 시각의 자리에 놓이고(--a, --o), 거기서부터 돈다(--d). 분·시간 고리는 1초에 한 번만 움직인다. */
.dialbox{position:absolute;z-index:0;top:8px;right:-30%;width:min(96%,400px);opacity:.6;pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom,#000 38%,transparent 62%);mask-image:linear-gradient(to bottom,#000 38%,transparent 62%)}
.dial{position:relative;aspect-ratio:1;max-width:380px;margin-left:auto;container-type:inline-size}
.dial svg{display:block;width:100%;height:100%;overflow:visible}
.dial circle,.dial path{fill:none}
.far circle{stroke:var(--ink);stroke-opacity:.07;vector-effect:non-scaling-stroke}
.tk{stroke:var(--ink);stroke-opacity:.28;stroke-width:5;stroke-dasharray:.4 5.6;stroke-dashoffset:.2}
.tk.maj{stroke-opacity:.6;stroke-width:9;stroke-dasharray:.5 29.5;stroke-dashoffset:.25}
.rb{stroke:var(--ink);stroke-opacity:.16;vector-effect:non-scaling-stroke}
.ra{stroke:var(--ink);stroke-width:1.5;stroke-dasharray:100px 100px;stroke-dashoffset:var(--o,100px);animation:sweep var(--t) var(--e,linear) var(--d,0s) infinite}
.rd{transform-origin:0 0;transform:rotate(var(--a,0deg));animation:orbit var(--t) var(--e,linear) var(--d,0s) infinite}
.dial .rd circle{fill:var(--ink)}
.dial .rd .halo{fill-opacity:.16}
[data-r="s"]{--t:60s}
[data-r="m"]{--t:3600s;--e:steps(3600)}
[data-r="h"]{--t:86400s;--e:steps(86400)}
[data-r="s"] .ra{stroke-width:2}
[data-r="m"] .ra{stroke-opacity:.8}
[data-r="h"] .ra{stroke-opacity:.5}
@keyframes orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes sweep{from{stroke-dashoffset:100px}to{stroke-dashoffset:0}}
.dc{position:absolute;inset:0;display:none;place-content:center;justify-items:center;gap:8px;text-align:center}
.dd{font-size:40px;font-weight:200;line-height:1;letter-spacing:-.03em}
@supports (width:1cqi){.dd{font-size:15cqi}}
.dk{font-size:13px;line-height:20px;color:var(--ink-2)}
.dcap{display:none;margin:16px 0 0 auto;text-align:center;font-size:12px;line-height:16px;color:var(--ink-3)}

/* 알아둘 것 세 가지. 좁으면 가는 선으로 나눈 줄, 넓으면 맨 아래 세 칸. */
.notes{position:relative;z-index:1;margin:0;padding:0 0 24px;list-style:none;border-top:1px solid var(--line);font-size:13px;line-height:20px;color:var(--ink-2)}
.notes li{padding:16px 0;border-top:1px solid var(--line);text-wrap:pretty}
.notes li:first-child{border-top:0}
.notes b{font-weight:600;color:var(--ink)}

@container stage (min-width:700px){
  .mid{grid-template-columns:minmax(0,1fr) min(42%,520px);column-gap:48px;align-items:center;padding:40px 0 56px}
  .dialbox{position:static;width:auto;opacity:1;-webkit-mask-image:none;mask-image:none}
  .dial,.dcap{max-width:min(520px,64vh)}
  .dc{display:grid}
  .dcap{display:block}
  .notes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:48px;padding:24px 0 32px}
  .notes li{padding:0;border-top:0}
}
@container stage (min-width:1100px){
  .mid{column-gap:64px}
}
/* 키가 작은 화면(노트북)에서도 로그인 단추가 첫 화면에 들어오게 한다. */
@media (min-width:900px) and (max-height:800px){
  .mid{padding:24px 0 32px}
  h1{font-size:min(40px,3.6vw)}
  form{margin-top:32px}
}

/* 처음 열릴 때만 차례로 떠오른다. 로그인이 틀려 다시 그려질 때(.re)는 그대로 선다. */
main:not(.re) .copy>*{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
main:not(.re) h1{animation-delay:.06s}
main:not(.re) form{animation-delay:.14s}
main:not(.re) .dialbox{animation:bloom 1.4s .1s cubic-bezier(.2,.7,.2,1) both}
main:not(.re) .notes{animation:rise .8s .3s cubic-bezier(.2,.7,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(16px)}}
@keyframes bloom{from{opacity:0;transform:scale(.94)}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
</style></head><body>
<main${message ? ' class="re"' : ""}>
<div class="in">
<div class="top"><div class="brand"><i aria-hidden="true"></i>ALL 캠퍼스</div></div>
<div class="mid">
<div class="copy">
<p class="state">로그인</p>
<h1><span>강남대학교 이러닝캠퍼스</span> <span>계정으로 로그인하면</span> <span>내 과제·강의 마감이 모입니다.</span></h1>
${message ? `<div class="err" role="alert">${esc(message)}</div>` : ""}
<form method="post" action="/login">
  <label for="u">이캠퍼스 아이디 (학번)</label>
  <input id="u" name="username" autocomplete="username" inputmode="numeric" required value="${esc(username)}">
  <label for="p">비밀번호</label>
  <input id="p" name="password" type="password" autocomplete="current-password" required>
  <label class="keep"><input type="checkbox" name="remember" value="1"${remember ? " checked" : ""}> 아이디 저장</label>
  <button type="submit">로그인</button>
</form>
</div>
<div class="dialbox" aria-hidden="true">
  <div class="dial">
    <svg viewBox="-200 -200 400 400" focusable="false">
      <g class="far"><circle r="236"/><circle r="292"/><circle r="368"/></g>
      <path class="tk" pathLength="360" d="M0-190A190 190 0 1 1 0 190A190 190 0 1 1 0-190"/>
      <path class="tk maj" pathLength="360" d="M0-188A188 188 0 1 1 0 188A188 188 0 1 1 0-188"/>
      <g data-r="s">
        <circle class="rb" r="172"/>
        <path class="ra" pathLength="100" d="M0-172A172 172 0 1 1 0 172A172 172 0 1 1 0-172"/>
        <g class="rd"><circle class="halo" cy="-172" r="10"/><circle cy="-172" r="4"/></g>
      </g>
      <g data-r="m">
        <circle class="rb" r="140"/>
        <path class="ra" pathLength="100" d="M0-140A140 140 0 1 1 0 140A140 140 0 1 1 0-140"/>
        <g class="rd"><circle class="halo" cy="-140" r="9"/><circle cy="-140" r="3.5"/></g>
      </g>
      <g data-r="h">
        <circle class="rb" r="108"/>
        <path class="ra" pathLength="100" d="M0-108A108 108 0 1 1 0 108A108 108 0 1 1 0-108"/>
        <g class="rd"><circle class="halo" cy="-108" r="8"/><circle cy="-108" r="3"/></g>
      </g>
    </svg>
    <div class="dc"><span class="dd num" id="day"></span><span class="dk" id="dow"></span></div>
  </div>
  <div class="dcap" id="cap"></div>
</div>
</div>
<ul class="notes">
  <li>학교가 운영하는 공식 서비스가 아닙니다. 재학생이 만든 개인 프로젝트입니다.</li>
  <li>비밀번호는 이캠퍼스 로그인 확인에 한 번만 쓰고 <b>저장하지 않습니다.</b></li>
  <li>저장하는 것은 학번, 이름, 일정 목록, 암호화한 달력 주소입니다. 로그인 뒤 화면 위쪽에서 언제든 전부 지울 수 있습니다.</li>
</ul>
</div>
</main>
<script nonce="${nonce}">
document.forms[0].addEventListener("submit",function(){
  var b=this.querySelector("button");b.disabled=true;b.textContent="이캠퍼스 확인 중…";
});
// 뒤로 가기로 이 화면이 그대로 되살아나면 단추를 다시 풀어 준다.
window.addEventListener("pageshow",function(e){
  if(!e.persisted) return;
  var b=document.querySelector("form button");b.disabled=false;b.textContent="로그인";
});
// 다이얼은 지금 시각(한국 시각)을 가리킨다. 바깥 고리는 1분, 가운데는 1시간, 안쪽은 하루에 한 바퀴 돈다.
// 로그인한 뒤 남은 마감이 없을 때 무대에 서는 다이얼과 같은 자리다.
(function(){
  var rings=[["s",60],["m",3600],["h",86400]];
  function now(){
    // 한국 시각으로 센 초. 이 값으로 만든 Date 의 UTC 쪽 값이 곧 한국의 날짜·요일이다.
    var t=Date.now()/1e3+32400,k=new Date(t*1e3);
    rings.forEach(function(r){
      var g=document.querySelector('[data-r="'+r[0]+'"]'),at=t%r[1],f=at/r[1];
      g.style.setProperty("--d",(-at).toFixed(2)+"s");
      g.style.setProperty("--a",(f*360).toFixed(2)+"deg");
      g.style.setProperty("--o",(100-f*100).toFixed(2)+"px");
      // 돌던 것을 새 자리에서 다시 돌린다(늦춤 값만 바꾸면 그동안 돈 만큼 겹쳐 어긋난다).
      [].forEach.call(g.querySelectorAll(".ra,.rd"),function(e){ e.style.animation="none"; e.getBoundingClientRect(); e.style.animation=""; });
    });
    document.getElementById("day").textContent=(k.getUTCMonth()+1)+"."+k.getUTCDate();
    document.getElementById("dow").textContent="일월화수목금토".charAt(k.getUTCDay())+"요일";
    return 86400-t%86400;
  }
  // 자정(한국 시각)에 날짜를 바꾸고, 다른 탭에 있다 돌아오면 시각을 다시 맞춘다.
  (function day(){ setTimeout(day,now()*1e3+500); })();
  document.addEventListener("visibilitychange",function(){ if(!document.hidden) now(); });
  document.getElementById("cap").textContent="바깥부터 초 · 분 · 시간";
})();
</script></body></html>`;

const html = (body, status = 200, headers = {}) =>
  new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", ...headers } });

async function doLogin(req, env, nonce) {
  if (!env.DATA_KEY) return html(loginPage("서버 설정이 덜 됐습니다 (DATA_KEY 비밀값 없음).", "", false, nonce), 500);

  const raw = await readBody(req, 4096);
  if (raw === null) return html(loginPage("보낸 내용이 너무 큽니다.", "", false, nonce), 413);
  const form = new URLSearchParams(raw);
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "");
  const remember = !!form.get("remember");
  if (!/^[A-Za-z0-9._@-]{4,32}$/.test(username) || !password || password.length > 256) {
    return html(loginPage("아이디와 비밀번호를 확인해 주세요.", /^[\w.@-]{0,32}$/.test(username) ? username : "", remember, nonce), 400);
  }

  // 이 문이 남의 비밀번호를 찍어 보는 도구가 되면 안 된다. 시도를 세서 잠근다.
  // 이캠퍼스는 아이디의 대소문자를 가리지 않으므로 소문자로 모아서 센다.
  const keys = ["u:" + username.toLowerCase(), "i:" + ipKey(req.headers.get("cf-connecting-ip"))];
  const tried = await attempt(env, keys);
  if (tried.locked) {
    return html(loginPage("로그인 시도가 너무 많습니다. 10분 뒤 다시 시도해 주세요.", username, remember, nonce), 429);
  }

  const got = await ecampusLogin(username, password, !!env.OWNER_ID && username === env.OWNER_ID);
  const at = new Date().toISOString();
  if (!got.ok) {
    // 틀린 비밀번호만 센다. 이캠퍼스가 죽었거나 다른 안내를 요구한 것은 찍어 본 것이 아니다.
    if (got.reason !== "bad") await tried.forget();
    const [message, status] = LOGIN_ERRORS[got.reason];
    return html(loginPage(message, username, remember, nonce), status);
  }
  await tried.forget();

  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const ics = await seal(env, got.ics);
  const stmts = [
    // 로그인할 때마다 달력 주소를 새로 받는다. 비밀번호를 바꿔 주소가 죽었어도 다시 로그인하면 살아난다.
    env.DB.prepare(
      `INSERT INTO users (id,ics,name,createdAt,lastLoginAt,lastSyncAt) VALUES (?,?,?,?,?,'')
       ON CONFLICT(id) DO UPDATE SET ics=excluded.ics, lastLoginAt=excluded.lastLoginAt,
         name=COALESCE(excluded.name, users.name)`
    ).bind(username, ics, got.name, at, at),
    // 세션은 해시만 둔다. DB 가 새도 남의 세션으로 못 들어온다.
    env.DB.prepare(`INSERT INTO sessions (id,user_id,expires) VALUES (?,?,?)`)
      .bind(await sha256(token), username, new Date(Date.now() + SESSION_DAYS * 86400e3).toISOString()),
    env.DB.prepare(`DELETE FROM login_fail WHERE key=?`).bind(keys[0]),
    // 로그인만 되풀이해서 세션을 끝없이 쌓지 못하게, 가장 늦게까지 살아 있는 것만 남긴다.
    env.DB.prepare(
      `DELETE FROM sessions WHERE user_id=? AND id NOT IN
         (SELECT id FROM sessions WHERE user_id=? ORDER BY expires DESC LIMIT ?)`
    ).bind(username, username, MAX_SESSIONS),
  ];
  // 1인용 시절 데이터는 'legacy' 로 옮겨져 있다. 주인이 처음 로그인할 때 가져간다.
  if (env.OWNER_ID && username === env.OWNER_ID) {
    for (const t of ["items", "logs", "sync_log"]) {
      stmts.push(env.DB.prepare(`UPDATE OR IGNORE ${t} SET user_id=? WHERE user_id='legacy'`).bind(username));
    }
  }
  await env.DB.batch(stmts);

  // 첫 화면이 비어 있지 않게 바로 한 번 당겨온다. 실패해도 로그인은 된 것이다.
  await syncUser(env, { id: username, ics }, got.times).catch(() => {});

  const headers = new Headers({ location: "/" });
  headers.append("set-cookie", sessionCookie(token, SESSION_DAYS * 86400));
  // 체크를 풀고 로그인하면 전에 적어 둔 학번도 지운다.
  headers.append("set-cookie", remember ? cookie(REMEMBER, username, 365 * 86400) : cookie(REMEMBER, "", 0));
  return new Response(null, { status: 303, headers });
}

// ── 화면 껍데기 ────────────────────────────────────────────────────

/**
 * 페이지에 주입하는 어댑터. claude.use("db") 와 같은 모양을 흉내 내서,
 * 아티팩트용으로 쓴 웹앱.html 을 고치지 않고 그대로 쓴다.
 */
const SHIM = (token, level, nonce, guest) => `
<script nonce="${nonce}">
(function(){
  // 읽기 전용이면 화면이 편집 손잡이를 스스로 감춘다.
  window.ddReadOnly = ${level !== "admin" ? "true" : "false"};
  // 만든 사람이 아니면 화면이 만든 사람 전용 안내(과목 설명, 터미널 작업 칸)를 감춘다.
  window.ddGuest = ${guest ? "true" : "false"};
  // 읽기 전용 링크만 토큰을 주소에 싣는다(쿠키가 막힌 브라우저 대비).
  // 로그인한 학생은 HttpOnly 세션 쿠키로만 다닌다 — 페이지에 세션을 적지 않는다.
  var T=${JSON.stringify(token || "").replace(/</g, "\\u003c")};
  function BASE(col,path){ return "/api/"+col+(path||"")+(T?"?t="+encodeURIComponent(T):""); }
  function req(col,method,path,body){
    return fetch(BASE(col,path),{method:method,headers:{"content-type":"application/json"},
      body:body?JSON.stringify(body):undefined}).then(function(r){
        // 세션이 끝났으면 로그인 화면으로 돌려보낸다.
        if(r.status===401 && !T){ location.href="/login"; }
        if(!r.ok) throw {code:r.status===401?"revoked":"unavailable",message:"요청 실패"};
        return r.status===204?null:r.json();
      });
  }
  function collection(name){
    var col = (name==="logs") ? "logs" : "items";
    return {
      doc:function(id){ return {
        set:function(d){ return req(col,"PUT","/"+encodeURIComponent(id),d); },
        delete:function(){ return req(col,"DELETE","/"+encodeURIComponent(id)); }
      };},
      onSnapshot:function(next,onErr){
        var dead=false;
        function pull(){
          if(dead) return;
          req(col,"GET").then(function(rows){
            next({docs:rows.map(function(r){return {id:r.id,exists:true,data:function(){return r;}};}),
                  size:rows.length,empty:!rows.length,metadata:{fromCache:false,hasPendingWrites:false}});
          }).catch(function(e){ if(onErr) onErr(e); });
        }
        pull();
        var t=setInterval(pull,20000);
        return function(){ dead=true; clearInterval(t); };
      }
    };
  }
  window.claude={use:function(n){ return Promise.resolve(n==="db"?{collection:collection,
    doc:function(){ throw new Error("미구현"); }}:null); }};

  // 서버가 이캠퍼스에 직접 붙는다. 화면은 이 함수의 존재로 버튼을 켠다.
  // 읽기 전용에서는 아예 만들지 않는다 — 눌러도 403 이 날 버튼을 보여줄 이유가 없다.
  if(!window.ddReadOnly) window.ddSync=function(){
    return fetch("/api/sync",{method:"POST"}).then(function(r){ return r.json(); });
  };
})();
</script>`;

/**
 * 로그인한 학생에게만 보이는 띠. 화면 파일(웹앱.html)은 계정을 모른다 — 여기서 얹는다.
 * 생김새는 껍데기의 .ddbar 가 기본값이고, 화면 파일이 같은 이름으로 덮어써 제 무대 위에 올린다.
 */
const BAR = (label, nonce) => `
<div class="ddbar">
  <span>${esc(label)}</span>
  <form method="post" action="/logout"><button type="submit">로그아웃</button></form>
  <button type="button" id="ddForget">내 데이터 삭제</button>
</div>
<script nonce="${nonce}">
document.getElementById("ddForget").addEventListener("click",function(){
  if(!confirm("이 서비스에 저장된 내 일정·기록·달력 주소를 전부 지우고 로그아웃합니다. 되돌릴 수 없습니다. 계속할까요?")) return;
  fetch("/api/me",{method:"DELETE"}).then(function(r){
    if(r.ok) location.href="/login"; else alert("지우지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
  });
});
</script>`;

// 아티팩트 런타임이 씌워 주던 껍데기를 여기서 똑같이 씌운다.
const shell = (fragment, token, level, label, nonce, guest) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>:root{color-scheme:light dark}body{margin:0;font:14px system-ui}
img{max-width:100%}[hidden]{display:none!important}
.ddbar{display:flex;gap:12px;justify-content:flex-end;align-items:center;padding:8px 16px;font-size:13px}
.ddbar form{margin:0}
.ddbar button{font:inherit;background:none;border:0;padding:0;color:inherit;text-decoration:underline;cursor:pointer}</style>
</head><body>${SHIM(token, level, nonce, guest)}${level === "admin" ? BAR(label, nonce) : ""}${
  // 화면 파일은 우리가 올린 것이라 믿는다. 그 안의 스크립트에도 같은 nonce 를 붙인다.
  fragment.replace(/<script(?=[\s>])/gi, `<script nonce="${nonce}"`)}</body></html>`;
// 어댑터가 화면보다 **먼저** 와야 한다. 화면은 로드 즉시 window.claude 를 확인하는데,
// 뒤에 두면 그 시점에 아직 없어서 데이터가 영영 안 붙는다. 실제로 그렇게 비어 보였다.

// ── HTTP ───────────────────────────────────────────────────────────

// ── 보안 헤더 ──────────────────────────────────────────────────────

/**
 * 화면에 실을 수 있는 것을 못 박는다. 스크립트는 이 요청에 발급한 nonce 가 붙은 것만 돈다 —
 * 과제 제목 같은 남이 쓴 글자가 어쩌다 이스케이프를 빠져나가도 실행되지 않는다.
 * 글꼴 두 곳(웹앱.html 이 부른다)만 바깥을 연다. 스타일은 화면이 style="" 을 써서 인라인을 둔다.
 */
// jsDelivr 에는 누구나 파일을 올릴 수 있다. 사이트 전체가 아니라 우리가 쓰는 글꼴의 경로만 연다.
const FONT_CDN = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/";
const CSP_PAGE = (nonce) => [
  "default-src 'none'",
  `script-src 'nonce-${nonce}'`,
  `style-src 'self' 'unsafe-inline' ${FONT_CDN} https://fonts.googleapis.com/css2`,
  `font-src ${FONT_CDN} https://fonts.gstatic.com`,
  "img-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  // 읽기 전용 링크는 주소에 토큰이 실린다. 바깥 사이트(글꼴 서버 포함)에 주소를 넘기지 않는다.
  // no-referrer 는 안 된다 — 브라우저가 로그인·로그아웃 양식에 Origin: null 을 실어 보내서
  // 아래의 출처 확인에 걸린다. 2026-11-13 에 그렇게 로그인이 전부 막혔다.
  "referrer-policy": "same-origin",
  "permissions-policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "x-robots-tag": "noindex, nofollow",
};

/** 나가는 응답 전부에 헤더를 얹는다. 길목이 하나라 새 주소를 만들어도 빠지지 않는다. */
function harden(res, nonce) {
  const isPage = (res.headers.get("content-type") || "").includes("text/html");
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  res.headers.set("content-security-policy", isPage ? CSP_PAGE(nonce) : "default-src 'none'; frame-ancestors 'none'");
  // 응답은 전부 그 학생의 것이다. 공용 PC 의 캐시나 중간 서버에 남기지 않는다.
  if (!res.headers.has("cache-control")) res.headers.set("cache-control", "no-store");
  return res;
}

const METHODS = ["GET", "HEAD", "POST", "PUT", "DELETE"];

/**
 * 쓰기 요청이 우리 화면에서 나온 것인가. 브라우저가 붙이는 표식 셋을 차례로 본다.
 * 하나라도 "다른 곳"이라고 하면 거절하고, **셋 다 없어도 거절한다** — 예전에는 Origin 이
 * 없으면 그냥 통과시켰다. 요즘 브라우저는 쓰기 요청에 Origin 을 반드시 붙인다.
 */
function sameOrigin(req, url) {
  const origin = req.headers.get("origin"), site = req.headers.get("sec-fetch-site"), referer = req.headers.get("referer");
  if (site && site !== "same-origin") return false;
  if (origin) return origin === url.origin;
  if (site) return true;
  try { return !!referer && new URL(referer).origin === url.origin; } catch { return false; }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[A-Za-z0-9_.-]{1,100}$/;
const isText = (v, max) => typeof v === "string" && v.length <= max;

/** 주소 끝의 문서 ID. % 인코딩이 깨져 있으면 null. */
function tail(pathname, prefix) {
  try { return decodeURIComponent(pathname.slice(prefix.length)); } catch { return null; }
}

const badValue = () => json({ ok: false, message: "저장할 수 없는 값입니다." }, 400);

/** JSON 본문을 읽는다. → 객체 | 응답(거절). 폼이 보낼 수 있는 형식은 받지 않는다. */
async function readJson(req, max) {
  if (!/^application\/json\b/i.test(req.headers.get("content-type") || "")) {
    return json({ ok: false, message: "JSON 으로 보내 주세요." }, 415);
  }
  const raw = await readBody(req, max);
  if (raw === null) return tooBig();
  try {
    const b = JSON.parse(raw);
    return b && typeof b === "object" && !Array.isArray(b) ? b : badValue();
  } catch {
    return badValue();
  }
}

/**
 * 화면이 보낸 항목을 그대로 믿지 않는다. 날짜 칸은 화면이 id="d-<날짜>" 처럼 HTML 에 바로
 * 넣으므로, 모양이 다른 값이 DB 에 들어가면 그 자리가 뚫린다. 틀리면 null.
 */
function cleanItem(b) {
  if (!b || typeof b !== "object") return null;
  const dueTime = b.dueTime || null, closes = b.closes || null, estimate = b.estimate ?? null;
  const status = b.status || "미착수", source = b.source || "수동", note = b.note || "";
  const ok = isText(b.title, 300) && b.title.trim() && isText(b.course, 100) && ["과제", "강의"].includes(b.kind)
    && isText(b.due, 10) && DATE_RE.test(b.due)
    && (dueTime === null || (isText(dueTime, 5) && /^\d{1,2}:\d{2}$/.test(dueTime)))
    && (closes === null || (isText(closes, 10) && DATE_RE.test(closes)))
    && (estimate === null || (typeof estimate === "number" && estimate >= 0 && estimate <= 1000))
    && isText(status, 20) && ["자동", "수동"].includes(source) && isText(note, 2000);
  // 아는 칸만 골라 담는다. 보낸 것을 통째로 넘기지 않는다.
  return ok ? { title: b.title, course: b.course, kind: b.kind, due: b.due, dueTime, closes, estimate, status, source, note } : null;
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(sweep(env));
  },

  async fetch(req, env, ctx) {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    let res;
    try {
      res = await route(req, env, ctx, nonce);
    } catch (err) {
      // 오류 내용은 밖으로 내보내지 않는다. 헤더는 오류 응답에도 붙는다.
      console.error("unhandled", String(err));
      res = json({ ok: false, message: "서버 오류입니다. 잠시 뒤 다시 시도해 주세요." }, 500);
    }
    return harden(res, nonce);
  },
};

async function route(req, env, ctx, nonce) {
  {
    const url = new URL(req.url);

    if (!METHODS.includes(req.method)) {
      return new Response(null, { status: 405, headers: { allow: METHODS.join(", ") } });
    }

    // 다른 사이트가 학생 브라우저를 시켜 보내는 쓰기 요청은 받지 않는다.
    if (req.method !== "GET" && req.method !== "HEAD" && !sameOrigin(req, url)) {
      return json({ ok: false, message: "허용되지 않은 출처입니다." }, 403);
    }

    if (url.pathname === "/login" && req.method === "POST") return doLogin(req, env, nonce);

    const who = await whoIs(req, env);

    if (url.pathname === "/login") {
      if (!who) {
        const saved = parseCookies(req)[REMEMBER] || "";
        const id = /^[A-Za-z0-9._@-]{4,32}$/.test(saved) ? saved : "";
        return html(loginPage("", id, !!id, nonce));
      }
      // 읽기 전용 링크: /login?t=<VIEW_TOKEN> 을 한 번 열면 쿠키가 박힌다.
      const headers = { location: "/" };
      if (who.level === "view") {
        headers["set-cookie"] = `${COOKIE}=${env.VIEW_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
      }
      return new Response(null, { status: 302, headers });
    }

    if (url.pathname === "/logout" && req.method === "POST") {
      const s = parseCookies(req)[SESSION];
      if (s) await env.DB.prepare(`DELETE FROM sessions WHERE id=?`).bind(await sha256(s)).run();
      return new Response(null, { status: 303, headers: { location: "/login", "set-cookie": sessionCookie("", 0) } });
    }

    if (!who) {
      const res = url.pathname.startsWith("/api/")
        ? json({ ok: false, message: "로그인이 필요합니다." }, 401)
        : new Response(null, { status: 302, headers: { location: "/login" } });
      // 안 맞는 읽기 전용 쿠키는 지운다. 두면 요청마다 틀린 열쇠로 세어져서 새 링크까지 잠긴다.
      if (parseCookies(req)[COOKIE]) res.headers.append("set-cookie", cookie(COOKIE, "", 0));
      return res;
    }
    const { level, user } = who;
    const uid = user.id;

    // 쓰기는 로그인한 본인만. 읽기 전용은 여기서 걸린다.
    if (req.method !== "GET" && req.method !== "HEAD" && level !== "admin") return readOnly();

    if (url.pathname === "/api/sync" && req.method === "POST") {
      // 버튼을 연달아 누르면 그만큼 이캠퍼스를 두드리게 된다. 방금 돌았으면 다시 돌지 않는다.
      // 읽고 나서 견주면 한꺼번에 온 요청이 전부 통과한다. 고쳐 쓰기에 성공한 한 건만 돈다.
      const now = Date.now();
      const claim = await env.DB.prepare(`UPDATE users SET lastSyncAt=? WHERE id=? AND lastSyncAt<?`)
        .bind(iso(now), uid, iso(now - SYNC_GAP_MS)).run();
      if (!claim.meta.changes) {
        return json({ ok: false, message: "방금 동기화했습니다. 잠시 뒤 다시 눌러 주세요." }, 429);
      }
      return json(await syncUser(env, user));
    }

    // 탈퇴. 이 학생에 대해 들고 있던 것을 전부 지운다.
    if (url.pathname === "/api/me" && req.method === "DELETE") {
      await env.DB.batch(["items", "logs", "sync_log", "sessions"].map((t) =>
        env.DB.prepare(`DELETE FROM ${t} WHERE user_id=?`).bind(uid))
        .concat(env.DB.prepare(`DELETE FROM users WHERE id=?`).bind(uid)));
      const gone = new Headers();
      gone.append("set-cookie", sessionCookie("", 0));
      gone.append("set-cookie", cookie(REMEMBER, "", 0));
      return new Response(null, { status: 204, headers: gone });
    }

    if (url.pathname === "/api/status") {
      const r = await env.DB.prepare(`SELECT at,ok,found,added,message FROM sync_log WHERE user_id=? ORDER BY at DESC LIMIT 5`)
        .bind(uid).all();
      return json(r.results || []);
    }

    if (url.pathname === "/api/items" && req.method === "GET") {
      // 오래됐으면 뒤에서 당겨온다. 응답은 기다리지 않고 지금 있는 것을 준다 — 다음 폴링에 새 항목이 뜬다.
      if (level === "admin" && (!user.lastSyncAt || Date.now() - Date.parse(user.lastSyncAt) > STALE_MS)) {
        ctx.waitUntil(syncUser(env, user).catch(() => {}));
      }
      const r = await env.DB.prepare(
        `SELECT id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt
         FROM items WHERE user_id=? ORDER BY due`).bind(uid).all();
      return json(r.results || []);
    }

    // 하루치 계획. 본문은 JSON 문자열로 통째 보관한다 —
    // 모양이 화면 쪽 사정에 따라 바뀌므로 칸을 미리 못 박지 않는다.
    if (url.pathname === "/api/logs" && req.method === "GET") {
      const r = await env.DB.prepare(`SELECT id, body FROM logs WHERE user_id=? ORDER BY id DESC LIMIT 60`).bind(uid).all();
      return json((r.results || []).map((row) => {
        let b = {};
        try { b = JSON.parse(row.body); } catch { /* 깨진 줄은 빈 것으로 본다 */ }
        return { ...b, id: row.id, date: b.date || row.id };
      }));
    }

    if (url.pathname.startsWith("/api/logs/")) {
      const id = tail(url.pathname, "/api/logs/");
      if (id === null) return badValue();
      if (req.method === "DELETE") {
        await env.DB.prepare(`DELETE FROM logs WHERE user_id=? AND id=?`).bind(uid, id).run();
        return new Response(null, { status: 204 });
      }
      if (req.method === "PUT") {
        if (!DATE_RE.test(id)) return badValue();
        const b = await readJson(req, 64 * 1024);
        if (b instanceof Response) return b;
        if (JSON.stringify(b).length > 20000) return tooBig();
        const n = await env.DB.prepare(`SELECT COUNT(*) AS n, SUM(id=?) AS has FROM logs WHERE user_id=?`).bind(id, uid).first();
        if (!n.has && n.n >= MAX_LOGS) return json({ ok: false, message: "계획이 너무 많이 쌓였습니다. 지난 것을 지워 주세요." }, 400);
        await env.DB.prepare(
          `INSERT INTO logs (user_id, id, body, updatedAt) VALUES (?,?,?,?)
           ON CONFLICT(user_id, id) DO UPDATE SET body=excluded.body, updatedAt=excluded.updatedAt`
        ).bind(uid, id, JSON.stringify(b), new Date().toISOString()).run();
        return new Response(null, { status: 204 });
      }
    }

    if (url.pathname.startsWith("/api/items/")) {
      const id = tail(url.pathname, "/api/items/");
      if (id === null) return badValue();
      if (req.method === "DELETE") {
        await env.DB.prepare(`DELETE FROM items WHERE user_id=? AND id=?`).bind(uid, id).run();
        return new Response(null, { status: 204 });
      }
      if (req.method === "PUT") {
        if (!ID_RE.test(id)) return badValue();
        const sent = await readJson(req, 16 * 1024);
        if (sent instanceof Response) return sent;
        const b = cleanItem(sent);
        if (!b) return badValue();
        const n = await env.DB.prepare(`SELECT COUNT(*) AS n, SUM(id=?) AS has FROM items WHERE user_id=?`).bind(id, uid).first();
        if (!n.has && n.n >= MAX_ITEMS) return json({ ok: false, message: "일정이 너무 많습니다. 지난 것을 지워 주세요." }, 400);
        await env.DB.prepare(
          `INSERT INTO items (user_id,id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(user_id, id) DO UPDATE SET
             title=excluded.title, course=excluded.course, kind=excluded.kind, due=excluded.due,
             dueTime=excluded.dueTime, closes=COALESCE(excluded.closes, items.closes),
             estimate=excluded.estimate, status=excluded.status,
             source=excluded.source, note=excluded.note, updatedAt=excluded.updatedAt`
        ).bind(uid, id, b.title, b.course, b.kind, b.due, b.dueTime, b.closes,
               b.estimate, b.status || "미착수", b.source || "수동",
               b.note || "", new Date().toISOString()).run();
        return new Response(null, { status: 204 });
      }
    }

    if (url.pathname.startsWith("/api/")) return json({ ok: false, message: "없는 주소입니다." }, 404);

    // 화면
    const asset = await env.ASSETS.fetch(new Request(new URL("/app.html", url)));
    if (!asset.ok) return new Response("화면 파일(app.html)이 없습니다. build 를 먼저 돌리세요.", { status: 500 });
    const headers = { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" };
    if (level === "view") {
      headers["set-cookie"] = `${COOKIE}=${env.VIEW_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
    }
    // 쓰는 동안에는 로그인이 풀리지 않게 한다. 하루에 한 번만 늘린다 — 화면을 열 때마다 DB 를 쓰지 않는다.
    if (level === "admin" && Date.parse(user.expires) - Date.now() < (SESSION_DAYS - 1) * 86400e3) {
      const s = parseCookies(req)[SESSION];
      await env.DB.prepare(`UPDATE sessions SET expires=? WHERE id=?`)
        .bind(new Date(Date.now() + SESSION_DAYS * 86400e3).toISOString(), await sha256(s)).run();
      headers["set-cookie"] = sessionCookie(s, SESSION_DAYS * 86400);
    }
    // 읽기 전용 링크는 만든 사람의 화면이다. 그 밖에는 OWNER_ID 로 로그인한 사람만 만든 사람이다.
    const guest = level === "admin" && uid !== env.OWNER_ID;
    return new Response(shell(await asset.text(), level === "view" ? env.VIEW_TOKEN : "", level, user.name || uid, nonce, guest), { headers });
  }
}
