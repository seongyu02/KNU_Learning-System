/**
 * 마감 계기판 — Cloudflare Worker (단일 사용자용)
 *
 * 하는 일
 *   1) 1시간마다 이캠퍼스 일정(.ics)을 직접 받아 D1 에 반영한다. 사람 손이 안 간다.
 *      화면의 '지금 동기화' 버튼으로 즉시 당겨올 수도 있다.
 *   2) 같은 화면(내과제/웹앱.html)을 서빙한다. 화면은 포크하지 않는다 —
 *      claude.use("db") 와 같은 모양의 어댑터를 주입해서 한 벌로 양쪽에서 쓴다.
 *
 * 왜 서버가 필요한가
 *   브라우저는 이캠퍼스에 직접 못 붙는다. 달력 URL 이 인증 토큰이라 페이지에 넣으면
 *   유출이고, 외부 도메인 요청도 막혀 있다. 서버는 둘 다 해당이 없다.
 *
 * 비밀값 (wrangler secret put)
 *   ICS_URL    이캠퍼스 달력 URL. 이 사람의 일정 전체를 읽는 열쇠다
 *   APP_TOKEN  이 페이지를 여는 임의의 긴 문자열
 */

// 순수 함수는 밖으로 뺀다 — test.mjs 가 실제 피드로 검증한다.
export { h32, idFor, parseIcs, classify, toKstDate };

const KST_OFFSET = 9 * 60 * 60 * 1000;
const COOKIE = "dd_token";
const EXCLUDE_COURSES = ["신입생세미나"]; // 멘토라 제출물이 없는 과목

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
function classify(ev) {
  const cat = unescapeIcal(ev.CATEGORIES || "");
  const title = unescapeIcal(ev.SUMMARY || "(제목없음)");
  const rawStart = ev.DTSTART || "";
  const params = ev["params:DTSTART"] || "";

  if (HASH_RE.test(cat)) return null; // 비교과

  const m = COURSE_RE.exec(cat);
  const course = m ? m[1] : cat || "(과목미상)";
  if (EXCLUDE_COURSES.some((x) => course.includes(x))) return null;

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
  };
}

// ── 동기화 ─────────────────────────────────────────────────────────

async function sync(env) {
  const at = new Date().toISOString();
  if (!env.ICS_URL) {
    await log(env, at, 0, 0, 0, "ICS_URL 비밀값이 없습니다");
    return { ok: false, message: "ICS_URL 비밀값이 없습니다" };
  }

  let res;
  try {
    res = await fetch(env.ICS_URL, { cf: { cacheTtl: 0 } });
  } catch {
    await log(env, at, 0, 0, 0, "이캠퍼스에 연결하지 못했습니다");
    return { ok: false, message: "이캠퍼스에 연결하지 못했습니다" };
  }
  if (!res.ok) {
    // 토큰이 만료되면 여기로 온다. 조용히 넘어가면 며칠 뒤에야 알아차린다.
    const msg = `이캠퍼스가 HTTP ${res.status}. 달력 URL이 만료됐을 수 있습니다`;
    await log(env, at, 0, 0, 0, msg);
    return { ok: false, message: msg };
  }

  const events = parseIcs(await res.text()).map(classify).filter(Boolean);
  let added = 0;

  for (const e of events) {
    const id = idFor(e.course, e.title, e.due);
    // 이미 있으면 건드리지 않는다. 사람이 넣은 예상소요·완료표시를 덮으면 안 된다.
    const r = await env.DB.prepare(
      `INSERT OR IGNORE INTO items (id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt)
       VALUES (?,?,?,?,?,NULL,?,NULL,'미착수','자동','',?)`
    ).bind(id, e.title, e.course, e.kind, e.due, e.closes, at).run();
    if (r.meta && r.meta.changes) added++;
    // 닫히는 날은 이캠퍼스가 주인인 값이라 매번 따라간다. 사람이 고친 칸은 건드리지 않는다.
    else if (e.closes) {
      await env.DB.prepare(`UPDATE items SET closes=? WHERE id=? AND closes IS NOT ?`)
        .bind(e.closes, id, e.closes).run();
    }
  }

  await log(env, at, 1, events.length, added, "");
  return { ok: true, found: events.length, added };
}

const log = (env, at, ok, found, added, message) =>
  env.DB.prepare(`INSERT OR REPLACE INTO sync_log (at,ok,found,added,message) VALUES (?,?,?,?,?)`)
    .bind(at, ok, found, added, message).run().catch(() => {});

// ── HTTP ───────────────────────────────────────────────────────────

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8" } });

/**
 * 쿠키 또는 주소의 ?t= 로 통과시킨다.
 *
 * 쿠키만 받으면 브라우저 설정 하나에 통째로 막힌다 — 실제로 막혔다.
 * 링크에 토큰이 붙어 있으면 쿠키가 안 붙는 환경에서도 열린다.
 */
/**
 * 토큰을 등급으로 가른다.
 *
 *   APP_TOKEN   나        — 보기 + 고치기
 *   VIEW_TOKEN  채점·공유 — 보기만. 체크·추가·삭제·동기화가 전부 막힌다
 *
 * 링크를 남에게 드려도 데이터가 안 망가지게 하려는 것이다.
 * 쿠키와 주소의 ?t= 둘 다 본다 — 쿠키만 받으면 브라우저 설정 하나에 막힌다.
 */
function levelOf(req, env) {
  const q = new URL(req.url).searchParams.get("t");
  const c = req.headers.get("cookie") || "";
  const m = new RegExp("(?:^|; )" + COOKIE + "=([^;]+)").exec(c);
  const given = [q, m && m[1]].filter(Boolean);
  if (env.APP_TOKEN && given.includes(env.APP_TOKEN)) return "admin";
  if (env.VIEW_TOKEN && given.includes(env.VIEW_TOKEN)) return "view";
  return null;
}

/** 통과한 요청에는 그 사람이 쓴 토큰을 쿠키로 심는다. 등급이 섞이면 안 된다. */
function withCookie(res, req, env, level) {
  const token = level === "admin" ? env.APP_TOKEN : env.VIEW_TOKEN;
  if (!token) return res;
  const h = new Headers(res.headers);
  h.append("set-cookie",
    `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`);
  return new Response(res.body, { status: res.status, headers: h });
}

const readOnly = (msg) =>
  json({ ok: false, message: msg || "읽기 전용 링크입니다. 고칠 수 없습니다." }, 403);

/**
 * 페이지에 주입하는 어댑터. claude.use("db") 와 같은 모양을 흉내 내서,
 * 아티팩트용으로 쓴 웹앱.html 을 고치지 않고 그대로 쓴다.
 */
const SHIM = (token, level) => `
<script>
(function(){
  // 읽기 전용이면 화면이 편집 손잡이를 스스로 감춘다.
  window.ddReadOnly = ${level !== "admin" ? "true" : "false"};
  // 쿠키가 막힌 브라우저에서도 돌도록 토큰을 주소에 싣는다.
  // 이 페이지는 이미 통과한 요청에만 나가므로 여기 토큰이 있어도 노출이 늘지 않는다.
  var T=${JSON.stringify(token || "")};
  function BASE(col,path){ return "/api/"+col+(path||"")+(T?"?t="+encodeURIComponent(T):""); }
  function req(col,method,path,body){
    return fetch(BASE(col,path),{method:method,headers:{"content-type":"application/json"},
      body:body?JSON.stringify(body):undefined}).then(function(r){
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
    return fetch("/api/sync"+(T?"?t="+encodeURIComponent(T):""),{method:"POST"})
      .then(function(r){ return r.json(); });
  };
})();
</script>`;

// 아티팩트 런타임이 씌워 주던 껍데기를 여기서 똑같이 씌운다.
const shell = (fragment, token, level) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>:root{color-scheme:light dark}body{margin:0;font:14px system-ui}
img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>${SHIM(token, level)}${fragment}</body></html>`;
// 어댑터가 화면보다 **먼저** 와야 한다. 화면은 로드 즉시 window.claude 를 확인하는데,
// 뒤에 두면 그 시점에 아직 없어서 데이터가 영영 안 붙는다. 실제로 그렇게 비어 보였다.

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(sync(env));
  },

  async fetch(req, env) {
    const url = new URL(req.url);

    const level = levelOf(req, env);

    // 문 열기: /login?t=<토큰> 을 한 번 열면 그 등급의 쿠키가 박힌다.
    if (url.pathname === "/login") {
      if (!level) return new Response("접근할 수 없습니다", { status: 401 });
      const token = level === "admin" ? env.APP_TOKEN : env.VIEW_TOKEN;
      return new Response(null, {
        status: 302,
        headers: {
          location: "/",
          "set-cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
        },
      });
    }

    if (!level) {
      return new Response(
        "열쇠가 없습니다.\n\n" +
        "주소 끝에 ?t=<APP_TOKEN> 을 붙여서 여세요.\n" +
        "APP_TOKEN 은 내과제/.env.local 에 있습니다.\n" +
        "바탕이 되는 바로가기: 내과제/계기판 열기.url",
        { status: 401, headers: { "content-type": "text/plain; charset=utf-8" } });
    }

    // 쓰기는 admin 만. 읽기 전용은 여기서 걸린다.
    const writing = req.method === "PUT" || req.method === "DELETE"
      || (url.pathname === "/api/sync" && req.method === "POST");
    if (writing && level !== "admin") return readOnly();

    if (url.pathname === "/api/sync" && req.method === "POST") return json(await sync(env));

    if (url.pathname === "/api/status") {
      const r = await env.DB.prepare(`SELECT * FROM sync_log ORDER BY at DESC LIMIT 5`).all();
      return json(r.results || []);
    }

    if (url.pathname === "/api/items" && req.method === "GET") {
      const r = await env.DB.prepare(`SELECT * FROM items ORDER BY due`).all();
      return json(r.results || []);
    }

    // 하루치 계획. 본문은 JSON 문자열로 통째 보관한다 —
    // 모양이 화면 쪽 사정에 따라 바뀌므로 칸을 미리 못 박지 않는다.
    if (url.pathname === "/api/logs" && req.method === "GET") {
      const r = await env.DB.prepare(`SELECT * FROM logs ORDER BY id DESC LIMIT 60`).all();
      return json((r.results || []).map((row) => {
        let b = {};
        try { b = JSON.parse(row.body); } catch { /* 깨진 줄은 빈 것으로 본다 */ }
        return { ...b, id: row.id, date: b.date || row.id };
      }));
    }

    if (url.pathname.startsWith("/api/logs/")) {
      const id = decodeURIComponent(url.pathname.slice("/api/logs/".length));
      if (req.method === "DELETE") {
        await env.DB.prepare(`DELETE FROM logs WHERE id=?`).bind(id).run();
        return new Response(null, { status: 204 });
      }
      if (req.method === "PUT") {
        const b = await req.json();
        await env.DB.prepare(
          `INSERT INTO logs (id, body, updatedAt) VALUES (?,?,?)
           ON CONFLICT(id) DO UPDATE SET body=excluded.body, updatedAt=excluded.updatedAt`
        ).bind(id, JSON.stringify(b), new Date().toISOString()).run();
        return new Response(null, { status: 204 });
      }
    }

    if (url.pathname.startsWith("/api/items/")) {
      const id = decodeURIComponent(url.pathname.slice("/api/items/".length));
      if (req.method === "DELETE") {
        await env.DB.prepare(`DELETE FROM items WHERE id=?`).bind(id).run();
        return new Response(null, { status: 204 });
      }
      if (req.method === "PUT") {
        const b = await req.json();
        await env.DB.prepare(
          `INSERT INTO items (id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET
             title=excluded.title, course=excluded.course, kind=excluded.kind, due=excluded.due,
             dueTime=excluded.dueTime, closes=COALESCE(excluded.closes, items.closes),
             estimate=excluded.estimate, status=excluded.status,
             source=excluded.source, note=excluded.note, updatedAt=excluded.updatedAt`
        ).bind(id, b.title, b.course, b.kind, b.due, b.dueTime ?? null, b.closes ?? null,
               b.estimate ?? null, b.status || "미착수", b.source || "수동",
               b.note || "", new Date().toISOString()).run();
        return new Response(null, { status: 204 });
      }
    }

    // 화면
    const asset = await env.ASSETS.fetch(new Request(new URL("/app.html", url)));
    if (!asset.ok) return new Response("화면 파일(app.html)이 없습니다. build 를 먼저 돌리세요.", { status: 500 });
    const pageToken = level === "admin" ? env.APP_TOKEN : env.VIEW_TOKEN;
    return withCookie(new Response(shell(await asset.text(), pageToken, level), {
      headers: { "content-type": "text/html; charset=utf-8" },
    }), req, env, level);
  },
};
