#!/usr/bin/env python3
"""이캠퍼스 일정(iCal)을 받아 과제 / 강의차시 / 비교과로 갈라낸다.

사용:
    python 내과제/일정가져오기.py            텍스트로 출력
    python 내과제/일정가져오기.py --html      대시보드 HTML 생성 후 경로 출력

읽는 것: 내과제/.env.local 의 ICS_URL
보안:   ICS_URL 은 인증 토큰이다. 이 스크립트는 URL 을 출력하지 않는다.
        생성되는 HTML 에도 URL 은 들어가지 않는다.
"""
import os
import re
import sys
import html
import datetime
import unicodedata
import urllib.request
import urllib.error

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

KST = datetime.timezone(datetime.timedelta(hours=9))
HERE = os.path.dirname(os.path.abspath(__file__))
ENV = os.path.join(HERE, ".env.local")
HTML_OUT = os.path.join(HERE, "대시보드.html")
BS = chr(92)  # 역슬래시. iCal 이스케이프를 풀 때만 쓴다

# 과제 관리에서 제외할 과목. 과목.md 의 '과제 관리 X' 와 같아야 한다.
제외과목 = ["신입생세미나"]


# ── 수집 ──────────────────────────────────────────────────────────────

def read_url():
    if not os.path.exists(ENV):
        sys.exit("[중단] 내과제/.env.local 이 없습니다. .env.local.example 을 복사해 URL 을 넣으세요.")
    for line in open(ENV, encoding="utf-8"):
        if line.startswith("ICS_URL="):
            url = line.split("=", 1)[1].strip()
            if "export_execute" not in url or "authtoken" not in url:
                sys.exit("[중단] ICS_URL 이 달력 URL 형식이 아닙니다. "
                         "export.php 에서 '일정 URL 불러오기' 결과를 넣으세요.")
            return url
    sys.exit("[중단] .env.local 에 ICS_URL 줄이 없습니다.")


def fetch(url):
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            return r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        sys.exit("[중단] 이캠퍼스가 HTTP %d 를 돌려줬습니다. "
                 "토큰이 만료됐을 수 있습니다 — 달력 URL 을 다시 받으세요." % e.code)
    except Exception:
        sys.exit("[중단] 일정을 받지 못했습니다. 네트워크 또는 URL 을 확인하세요.")


def parse(raw):
    """VEVENT 들을 딕셔너리 목록으로. 접힌 줄(다음 줄 첫 칸이 공백)은 먼저 편다."""
    raw = re.sub(r"\r?\n[ \t]", "", raw.replace("\r\n", "\n"))
    events = []
    for block in raw.split("BEGIN:VEVENT")[1:]:
        ev = {}
        for line in block.split("END:VEVENT")[0].strip().split("\n"):
            if ":" not in line:
                continue
            key, val = line.split(":", 1)
            name = key.split(";")[0]
            ev[name] = val
            ev["params:" + name] = key
        events.append(ev)
    return events


def unescape(s):
    """iCal 이스케이프 해제 + 한글 정규화(NFC).

    이캠퍼스는 제목 일부를 NFD(분해형 한글)로 내보낸다. `나` 가 `ㄴ`+`ㅏ` 두 글자로
    들어 있어서, 눈에는 한글로 보이는데 프로그램에게는 한글이 아니다.
    실제로 '나만의_자비스_만들기' 의 식별자가 통째로 비어 버렸다.
    여기서 한 번 NFC 로 모아두지 않으면 같은 과제가 두 개로 갈라진다.
    """
    s = unicodedata.normalize("NFC", s)
    return (s.replace(BS + ",", ",")
             .replace(BS + ";", ";")
             .replace(BS + "n", " ")
             .strip())


COURSE_RE = re.compile(r"^(.+?)[(]\d{4}년도.*?([A-Z]{2}\d{5}).*?[)]$")
HASH_RE = re.compile(r"^[0-9a-f]{32}$")


def to_kst_date(raw, date_only):
    """DTSTART 문자열에서 한국시간 기준 날짜(YYYYMMDD)를 뽑는다.

    시각이 붙은 이벤트는 UTC(끝에 Z)로 온다. 그대로 앞 8자를 자르면
    한국시간으로 다음 날인 일정이 하루 당겨진다 — 실제로 금요일 강의차시가
    목요일로 찍혔다. 그래서 시각이 있으면 반드시 KST 로 옮긴 뒤 날짜를 뽑는다.
    날짜만 있는 이벤트(과제 마감)는 이미 현지 날짜라 변환하지 않는다.
    """
    if not raw:
        return ""
    if date_only:
        return raw[:8]
    try:
        dt = datetime.datetime.strptime(raw.rstrip("Z"), "%Y%m%dT%H%M%S")
    except ValueError:
        return raw[:8]
    if raw.endswith("Z"):
        dt = dt.replace(tzinfo=datetime.timezone.utc).astimezone(KST)
    return dt.strftime("%Y%m%d")


def classify(ev):
    """{종류, 과목, 학수번호, 날짜, 제목} 하나.

    분류 규칙 — 2026-09-24 실제 피드 18건을 눈으로 확인하고 세웠다:
      · CATEGORIES 가 32자리 16진수       → 비교과·외부특강
      · 과목이 제외과목 목록에 있다        → 제외 (멘토라 과제가 없는 과목)
      · DTSTART 에 시간이 없다(VALUE=DATE) → 과제 마감
      · DTSTART 에 시간이 있다             → 강의차시(동영상·열람기간)
    """
    cat = unescape(ev.get("CATEGORIES", ""))
    title = unescape(ev.get("SUMMARY", "(제목없음)"))
    raw = ev.get("DTSTART", "")
    params = ev.get("params:DTSTART", "")
    date_only = "VALUE=DATE" in params or len(raw.rstrip("Z")) == 8
    start = to_kst_date(raw, date_only)
    # 강의차시의 DTSTART 는 열리는 때, DTEND 는 닫히는 때다. 마감이 아니다.
    end_raw = ev.get("DTEND", "")
    closes = to_kst_date(end_raw, False) if (end_raw and not date_only) else ""

    if HASH_RE.match(cat):
        return dict(kind="비교과", course="비교과·외부특강", code="", date=start, title=title)

    m = COURSE_RE.match(cat)
    course, code = (m.group(1), m.group(2)) if m else (cat or "(과목미상)", "")

    for x in 제외과목:
        if x in course:
            return dict(kind="제외", course=course, code=code, date=start, title=title)

    return dict(kind="과제" if date_only else "강의차시",
                course=course, code=code, date=start, title=title,
                closes=closes if not date_only else "")


# ── 날짜 계산 ──────────────────────────────────────────────────────────

def as_date(s):
    try:
        return datetime.datetime.strptime(s, "%Y%m%d").date()
    except ValueError:
        return None


def dday_label(d, today):
    if d is None:
        return "?"
    n = (d - today).days
    if n < 0:
        return "지남 %d일" % -n
    return "오늘" if n == 0 else ("내일" if n == 1 else "D-%d" % n)


def collect():
    events = [classify(e) for e in parse(fetch(read_url()))]
    today = datetime.datetime.now(KST).date()
    for e in events:
        e["d"] = as_date(e["date"])
        e["dday"] = (e["d"] - today).days if e["d"] else 9999
        e["label"] = dday_label(e["d"], today)
    return events, today


# ── 텍스트 출력 ────────────────────────────────────────────────────────

def print_text(events, today):
    def rows(kind):
        return sorted([e for e in events if e["kind"] == kind], key=lambda e: e["dday"])

    print("# 이캠퍼스 일정 — %s 기준, 총 %d건" % (today, len(events)))
    r = rows("과제")
    print()
    print("## 과제 (%d건)" % len(r))
    print()
    print("| 마감 | D- | 과목 | 제목 |")
    print("|---|---|---|---|")
    for e in r:
        print("| %s | %s | %s | %s |" % (e["date"] and e["d"], e["label"], e["course"], e["title"]))

    # 강의는 열리는 날이 첫 칸이고, 다섯째 칸이 시청이 닫히는 날이다. 첫 칸은 마감이 아니다.
    r = rows("강의차시")
    print()
    print("## 강의차시 (%d건)" % len(r))
    print()
    print("| 열림 | 열림까지 | 과목 | 제목 | 닫힘 |")
    print("|---|---|---|---|---|")
    for e in r:
        c = as_date(e.get("closes", ""))
        n = e["dday"]
        opened = ("열린 지 %d일" % -n) if n < 0 else ("오늘 열림" if n == 0 else e["label"])
        print("| %s | %s | %s | %s | %s |" % (e["date"] and e["d"], opened, e["course"], e["title"], c or "?"))
    others = [e for e in events if e["kind"] in ("비교과", "제외")]
    print()
    print("## 제외됨 %d건 (비교과·외부특강, 과제 없는 과목)" % len(others))


# ── 대시보드 ──────────────────────────────────────────────────────────

CSS = """
:root{--bg:#f6f7f9;--card:#fff;--fg:#14161a;--dim:#6b7280;--line:#e3e6ea;
--red:#c0392b;--redbg:#fdecea;--amber:#9a6700;--amberbg:#fff6e0;
--blue:#1c56b8;--bluebg:#e8f0fe;--green:#1a7f4b;}
@media (prefers-color-scheme:dark){:root{--bg:#0f1115;--card:#171a20;--fg:#e8eaed;
--dim:#9aa1ab;--line:#272b33;--redbg:#38201d;--red:#ff8a7a;--amberbg:#332a14;
--amber:#f0c060;--bluebg:#16243d;--blue:#89b4fa;--green:#5fd39a;}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
font:15px/1.6 -apple-system,"Segoe UI","Malgun Gothic",sans-serif;}
.wrap{max-width:1000px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:22px;margin:0 0 4px}
.sub{color:var(--dim);font-size:13px;margin-bottom:24px}
h2{font-size:15px;margin:28px 0 10px;display:flex;align-items:center;gap:8px}
.count{color:var(--dim);font-weight:400;font-size:13px}
.card{background:var(--card);border:1px solid var(--line);border-left-width:4px;
border-radius:8px;padding:12px 14px;margin-bottom:8px;display:flex;
justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start}
.card.now{border-left-color:var(--red);background:var(--redbg)}
.card.soon{border-left-color:var(--amber)}
.card.later{border-left-color:var(--line)}
.card.video{border-left-color:var(--blue)}
.t{font-weight:600}
.m{color:var(--dim);font-size:13px;margin-top:2px}
.right{text-align:right;white-space:nowrap}
.dd{font-weight:700;font-size:15px}
.dd.now{color:var(--red)}.dd.soon{color:var(--amber)}.dd.video{color:var(--blue)}
.left{font-variant-numeric:tabular-nums;color:var(--dim);font-size:12px}
.empty{color:var(--dim);font-size:13px;padding:10px 2px}
.note{background:var(--card);border:1px solid var(--line);border-radius:8px;
padding:12px 14px;color:var(--dim);font-size:13px;margin-top:28px}
.note b{color:var(--fg)}
@media(max-width:480px){.card{flex-direction:column}.right{text-align:left}}
"""

JS = """
function tick(){
  var now=Date.now();
  document.querySelectorAll('[data-due]').forEach(function(el){
    var ms=new Date(el.dataset.due).getTime()-now;
    if(isNaN(ms)){el.textContent='';return;}
    var past=ms<0; ms=Math.abs(ms);
    var h=Math.floor(ms/3600000), m=Math.floor(ms%3600000/60000), s=Math.floor(ms%60000/1000);
    var d=Math.floor(h/24);
    el.textContent=(past?'지남 ':'') + (d>0? d+'일 '+(h%24)+'시간' : h+'시간 '+m+'분 '+s+'초');
  });
}
tick(); setInterval(tick,1000);
"""


def card(e, cls, due_iso=None):
    left = ('<div class="left" data-due="%s"></div>' % due_iso) if due_iso else ""
    return (
        '<div class="card %s">'
        '<div><div class="t">%s</div><div class="m">%s%s</div></div>'
        '<div class="right"><div class="dd %s">%s</div>%s</div>'
        '</div>'
    ) % (cls, html.escape(e["title"]), html.escape(e["course"]),
         " · " + e["code"] if e["code"] else "", cls, e["label"], left)


def section(title, items, cls, empty, with_timer=False):
    out = ['<h2>%s <span class="count">%d</span></h2>' % (title, len(items))]
    if not items:
        out.append('<div class="empty">%s</div>' % empty)
    for e in items:
        due = ("%sT23:59:00+09:00" % e["d"]) if (with_timer and e["d"]) else None
        out.append(card(e, cls, due))
    return "\n".join(out)


def build_html(events, today):
    hw = sorted([e for e in events if e["kind"] == "과제" and e["dday"] >= -7],
                key=lambda e: e["dday"])
    vd = sorted([e for e in events if e["kind"] == "강의차시" and e["dday"] >= -7],
                key=lambda e: e["dday"])

    now = [e for e in hw if e["dday"] <= 0]
    soon = [e for e in hw if 1 <= e["dday"] <= 7]
    later = [e for e in hw if e["dday"] > 7]
    vnow = [e for e in vd if e["dday"] <= 1]
    vlater = [e for e in vd if e["dday"] > 1]

    stamp = datetime.datetime.now(KST).strftime("%Y-%m-%d %H:%M")
    body = "\n".join([
        '<div class="wrap">',
        '<h1>오늘의 과제</h1>',
        '<div class="sub">%s 기준 · 이캠퍼스 일정 %d건에서 추림 · 갱신 %s</div>'
        % (today, len(events), stamp),
        section("지금 급한 것", now, "now", "오늘 마감인 과제가 없습니다.", with_timer=True),
        section("이번 주", soon, "soon", "7일 안에 마감인 과제가 없습니다.", with_timer=True),
        section("나중", later, "later", "예정된 과제가 없습니다."),
        section("당장 봐야 할 강의", vnow, "video", "오늘·내일 열리는 강의가 없습니다."),
        section("다가오는 강의", vlater, "video", "없습니다."),
        '<div class="note">'
        '<b>마감 시각은 23:59 로 가정한 값입니다.</b> 이캠퍼스 일정에는 날짜만 오고 시각이 없습니다. '
        '정확한 시각은 강의실에서 확인하세요.<br>'
        '<b>디지털트윈프로그래밍 · 단기 K-프로젝트I 은 이 화면에 안 뜹니다.</b> '
        '이캠퍼스에 일정이 등록되지 않는 과목이라 주 1회 직접 확인이 필요합니다.<br>'
        '갱신: <code>python 내과제/일정가져오기.py --html</code>'
        '</div>',
        '</div>',
    ])
    return ("<!doctype html><html lang=ko><head><meta charset=utf-8>"
            "<meta name=viewport content='width=device-width,initial-scale=1'>"
            "<title>오늘의 과제</title><style>%s</style></head><body>%s"
            "<script>%s</script></body></html>" % (CSS, body, JS))


def main():
    events, today = collect()
    if "--html" in sys.argv:
        with open(HTML_OUT, "w", encoding="utf-8") as f:
            f.write(build_html(events, today))
        print("대시보드 생성: %s" % HTML_OUT)
        print("브라우저로 열면 남은 시간이 실시간으로 갱신됩니다.")
    else:
        print_text(events, today)


if __name__ == "__main__":
    main()
