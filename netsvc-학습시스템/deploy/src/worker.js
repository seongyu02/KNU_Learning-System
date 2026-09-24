/**
 * 마감 계기판 — Cloudflare Worker (단일 사용자용)
 *
 * 하는 일
 *   1) 6시간마다 이캠퍼스 일정(.ics)을 직접 받아 D1 에 반영한다. 사람 손이 안 간다.
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

  return {
    title,
    course,
    kind: dateOnly ? "과제" : "강의",
    due: `${d8.slice(0, 4)}-${d8.slice(4, 6)}-${d8.slice(6, 8)}`,
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
      `INSERT OR IGNORE INTO items (id,title,course,kind,due,dueTime,estimate,status,source,note,updatedAt)
       VALUES (?,?,?,?,?,NULL,NULL,'미착수','자동','',?)`
    ).bind(id, e.title, e.course, e.kind, e.due, at).run();
    if (r.meta && r.meta.changes) added++;
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

function authed(req, env) {
  if (!env.APP_TOKEN) return false;
  const c = req.headers.get("cookie") || "";
  const m = new RegExp("(?:^|; )" + COOKIE + "=([^;]+)").exec(c);
  return m && m[1] === env.APP_TOKEN;
}

/**
 * 페이지에 주입하는 어댑터. claude.use("db") 와 같은 모양을 흉내 내서,
 * 아티팩트용으로 쓴 웹앱.html 을 고치지 않고 그대로 쓴다.
 */
const SHIM = `
<script>
(function(){
  var BASE="/api/items";
  function req(method,path,body){
    return fetch(BASE+(path||""),{method:method,headers:{"content-type":"application/json"},
      body:body?JSON.stringify(body):undefined}).then(function(r){
        if(!r.ok) throw {code:r.status===401?"revoked":"unavailable",message:"요청 실패"};
        return r.status===204?null:r.json();
      });
  }
  function collection(){
    return {
      doc:function(id){ return {
        set:function(d){ return req("PUT","/"+encodeURIComponent(id),d); },
        delete:function(){ return req("DELETE","/"+encodeURIComponent(id)); }
      };},
      onSnapshot:function(next,onErr){
        var dead=false;
        function pull(){
          if(dead) return;
          req("GET").then(function(rows){
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
})();
</script>`;

// 아티팩트 런타임이 씌워 주던 껍데기를 여기서 똑같이 씌운다.
const shell = (fragment) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>:root{color-scheme:light dark}body{margin:0;font:14px system-ui}
img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>${fragment}${SHIM}</body></html>`;

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(sync(env));
  },

  async fetch(req, env) {
    const url = new URL(req.url);

    // 문 열기: /login?t=<APP_TOKEN> 을 한 번 열면 쿠키가 박힌다.
    if (url.pathname === "/login") {
      if (url.searchParams.get("t") !== env.APP_TOKEN) return new Response("접근할 수 없습니다", { status: 401 });
      return new Response(null, {
        status: 302,
        headers: {
          location: "/",
          "set-cookie": `${COOKIE}=${env.APP_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
        },
      });
    }

    if (!authed(req, env)) {
      return new Response("접근할 수 없습니다. /login?t=... 으로 여세요.", { status: 401 });
    }

    if (url.pathname === "/api/sync" && req.method === "POST") return json(await sync(env));

    if (url.pathname === "/api/status") {
      const r = await env.DB.prepare(`SELECT * FROM sync_log ORDER BY at DESC LIMIT 5`).all();
      return json(r.results || []);
    }

    if (url.pathname === "/api/items" && req.method === "GET") {
      const r = await env.DB.prepare(`SELECT * FROM items ORDER BY due`).all();
      return json(r.results || []);
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
          `INSERT INTO items (id,title,course,kind,due,dueTime,estimate,status,source,note,updatedAt)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET
             title=excluded.title, course=excluded.course, kind=excluded.kind, due=excluded.due,
             dueTime=excluded.dueTime, estimate=excluded.estimate, status=excluded.status,
             source=excluded.source, note=excluded.note, updatedAt=excluded.updatedAt`
        ).bind(id, b.title, b.course, b.kind, b.due, b.dueTime ?? null,
               b.estimate ?? null, b.status || "미착수", b.source || "수동",
               b.note || "", new Date().toISOString()).run();
        return new Response(null, { status: 204 });
      }
    }

    // 화면
    const asset = await env.ASSETS.fetch(new Request(new URL("/app.html", url)));
    if (!asset.ok) return new Response("화면 파일(app.html)이 없습니다. build 를 먼저 돌리세요.", { status: 500 });
    return new Response(shell(await asset.text()), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
