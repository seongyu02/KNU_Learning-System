# 배포 — Cloudflare Workers (강남대 학생 여러 명용)

ALL 캠퍼스(옛 이름 "마감 계기판")를 서버에 올린다. 학생은 **이캠퍼스 아이디·비밀번호로 로그인만 하면** 자기 과제·강의
마감이 뜬다. 회원가입도, 달력 주소 복사도 없다.

## 로그인이 하는 일

학교는 외부 서비스용 SSO·API 를 열어 주지 않는다. 그래서 학생이 브라우저로 하던 일을
서버가 **로그인할 때 한 번** 대신 한다.

```
학생이 아이디·비밀번호 입력
  → Worker 가 이캠퍼스에 로그인            (비밀번호는 이 요청 안에서만 쓰고 버린다)
  → 달력 내보내기에서 그 학생의 iCal 주소를 받는다
  → 과제가 걸린 날의 달력 화면을 열어 정확한 마감 시각을 받는다
  → 이캠퍼스에서 로그아웃
  → 주소를 암호화해 D1 에 저장, 세션 쿠키 발급, 첫 동기화
```

| 저장하는 것 | 저장하지 않는 것 |
|---|---|
| 학번, 이름, 일정 목록, **암호화한** 달력 주소, 세션 토큰의 해시 | 비밀번호, 이캠퍼스 세션 |

- 모든 조회·수정은 세션에서 꺼낸 `user_id` 로만 가른다. 주소나 본문에 실린 값은 믿지 않는다.
- 틀린 로그인은 아이디당 10분에 5번·하루 20번, 접속지당 10분에 20번·하루 200번에서 잠근다
  (아래 **공격을 막는 것** 참고).
- 학생이 이캠퍼스 비밀번호를 바꾸면 달력 주소도 죽는다. 다시 로그인하면 새로 받아 온다.
- iCal 에는 과제 날짜만 온다. **마감 시각은 로그인할 때만** 받아 온다(비밀번호를 안 들고 있어서
  그 뒤에는 그 화면을 못 연다). 로그인 뒤에 새로 올라온 과제는 다시 로그인할 때까지 23:59 로 보인다.
  한 번에 여는 화면은 30장까지라, 마감 날짜가 12가지를 넘으면 먼 쪽은 23:59 로 남는다.
- iCal 의 과제 날짜는 UTC 기준이다. **20일 00:00 마감은 19일로 온다.** 그래서 그 날 화면에 없으면
  다음 날 화면도 열고, 시각은 날짜를 그대로 둔 채 `24:00` 으로 적는다.
- 로그인은 30일 가고, 쓰는 동안에는 계속 늘어난다. **아이디 저장**을 켜면 그 브라우저에 학번만
  남는다. 비밀번호를 기억하는 일은 브라우저의 비밀번호 저장에 맡긴다 — 서버는 들고 있지 않는다.
- 화면 위쪽 **내 데이터 삭제**를 누르면 그 학생의 일정·기록·달력 주소·세션이 전부 지워진다.

## 보안 헤더

모든 응답은 `worker.js` 의 `harden()` 한 곳을 지나간다(`wrangler.toml` 의 `run_worker_first` 가
화면 파일까지 그 길로 보낸다). 붙는 것: HSTS, `nosniff`, 프레임 금지, `Referrer-Policy: same-origin`
(`no-referrer` 로 두면 브라우저가 로그인 양식에 `Origin: null` 을 실어 출처 확인에 걸린다),
권한 정책, `no-store`, 검색 제외, 그리고 CSP.

CSP 는 스크립트를 **요청마다 새로 뽑은 nonce 가 붙은 것만** 돌린다. 그래서 화면에
`onclick="…"` 같은 인라인 핸들러를 쓰면 조용히 안 돈다 — `addEventListener` 로 붙인다.
바깥에서 가져오는 것은 글꼴 두 곳(jsDelivr 의 Pretendard 경로, Google Fonts)뿐이고, jsDelivr 는
도메인 전체가 아니라 **그 글꼴 경로까지만** 연다(`FONT_CDN`). 글꼴 판을 올리거나 다른 CDN 을
쓰려면 `FONT_CDN` · `CSP_PAGE` 를 같이 고쳐야 한다.

## 공격을 막는 것

| 공격 | 막는 방법 |
|---|---|
| 비밀번호 찍기 | 시도를 **먼저 적고 나서 센다**(한꺼번에 쏴도 한도를 못 넘는다). 10분 한도와 하루 한도를 같이 건다. 아이디는 대소문자를 무시하고, IPv6 는 앞 /64 로 묶어 센다. 잠긴 동안의 시도는 잠금을 늘리지 않는다 — 남의 아이디를 일부러 계속 잠가 둘 수 없다 |
| 남의 브라우저로 몰래 요청 보내기(CSRF) | 쓰기 요청은 `Sec-Fetch-Site` · `Origin` · `Referer` 로 출처를 확인한다. 셋 다 없으면 거절한다. 쿠키는 `SameSite=Lax` |
| 남의 데이터 건드리기 | 조회·수정은 세션의 `user_id` 로만 가른다. 문서 ID 는 `ID_RE`, 날짜는 `DATE_RE` 에 맞아야 한다 |
| 이상한 값 끼워 넣기 | 본문은 `application/json` 만 받는다. `cleanItem()` 이 아는 칸만 골라 담고, 종류·출처·날짜·시각 형식이 틀리면 400 이다. SQL 은 전부 바인딩한다 |
| 서버를 채워서 죽이기 | 본문 크기(로그인 4KB, 항목 16KB, 계획 64KB), 사용자당 항목 3000건·계획 400일·세션 10개, 달력 파일 2MB, 동기화 30초 간격 |
| 읽기 전용 링크 찍기 | 틀린 토큰은 접속지당 10분에 10번·하루 100번에서 잠근다. 비교는 걸린 시간으로 새지 않게 한다 |
| 세션 훔치기 | 토큰은 256비트 난수, DB 에는 해시만 둔다. 쿠키는 `HttpOnly` · `Secure`. 모양이 틀린 쿠키는 DB 까지 가지 않는다 |

코드를 고치면 공격 시험을 다시 돌린다. Worker 를 Node 안에서 그대로 돌리고 가짜 이캠퍼스·가짜 DB 를
세워 공격하므로, 진짜 이캠퍼스나 운영 서버에는 요청이 나가지 않는다.

```bash
cd deploy
python build.py
node security.test.mjs      # 줄마다 "막힘" / "뚫림". 뚫림이 0 이어야 배포한다
```

코드로 못 막는 것이 하나 있다. **Cloudflare 계정이 털리면** Worker 를 바꿔 치워 로그인하는 학생의
비밀번호를 가로챌 수 있다. 그 계정에는 2단계 인증을 켜 둔다.

> **공식 서비스가 아니다.** 학생의 학교 비밀번호가 이 서버를 거쳐 간다. 저장하지 않더라도
> 그 사실은 로그인 화면에 적어 두었고, 지우면 안 된다. 학교 규정·이캠퍼스 약관상 문제가
> 없는지는 공개하기 전에 운영하는 사람이 확인한다. 2026-11-14 에 한 번 살펴본 기록이
> [docs/법과-학교정책-검토-정리.md](../docs/법과-학교정책-검토-정리.md) 에 있다. 학교의 허락은 아직 받지 않았다.

## 화면은 한 벌만 관리한다

`../내과제/웹앱.html` 이 원본이다. Claude 아티팩트와 이 Worker가 **같은 파일**을 쓴다.
Worker가 `claude.use("db")` 와 같은 모양의 어댑터를 주입해서, 화면 코드는 자기가
어디서 도는지 모른다. 로그아웃·삭제 띠도 Worker 가 얹는다 — 화면 파일은 계정을 모른다.

## 비밀값

```bash
wrangler secret put DATA_KEY     # 달력 주소 암호화 열쇠. 임의의 긴 문자열. 바꾸면 전원 재로그인
wrangler secret put OWNER_ID     # (선택) 만든 사람의 학번
wrangler secret put VIEW_TOKEN   # (선택) 읽기 전용 링크
```

`OWNER_ID` 가 하는 일은 넷이다. 1인용 시절 데이터를 그 학번이 처음 로그인할 때 넘겨받고,
`신입생세미나` 제외 규칙이 그 계정에만 걸리고, `…/?t=<VIEW_TOKEN>` 링크가 그 계정의 화면을
**보기만** 하고(쓰기는 403), 화면의 `data-owner` 칸(만든 사람의 과목 안내, 표 붙여넣기)이
그 계정에만 보인다. 과목 목록은 화면에 박지 않는다 — 각자의 일정에서 뽑는다. 예전의 `ICS_URL` · `APP_TOKEN` 은 더 쓰지 않는다 — 지워도 된다.

## 1인용에서 올라올 때 (한 번만)

```bash
cd deploy
wrangler d1 execute deadline --remote --file=migrate-multiuser.sql   # 기존 표에 user_id 를 넣는다
wrangler d1 execute deadline --remote --file=schema.sql              # users · sessions 를 만든다
wrangler d1 execute deadline --remote --file=migrate-name.sql        # 2026-11-13 전에 만든 DB 만. users 에 name 을 넣는다
wrangler secret put DATA_KEY
wrangler secret put OWNER_ID
python build.py
wrangler deploy
wrangler secret delete ICS_URL
wrangler secret delete APP_TOKEN
```

순서를 지킨다. 코드를 먼저 올리면 표가 옛 모양이라 전부 500 이 난다.

## 처음부터 만들 때

```bash
npm install -g wrangler && wrangler login
cd deploy
wrangler d1 create deadline          # 출력의 database_id 를 wrangler.toml 에 넣는다
wrangler d1 execute deadline --remote --file=schema.sql
wrangler secret put DATA_KEY
python build.py
wrangler deploy
```

## 로컬에서 돌려 보기

```bash
cd deploy
echo DATA_KEY=아무긴문자열 > .dev.vars          # gitignore 되어 있다
wrangler d1 execute deadline --local --file=schema.sql
python build.py
wrangler dev                                   # http://localhost:8787
node test.mjs ../내과제/예시일정.ics            # 파싱·ID·로그인 폼 처리 검증
node security.test.mjs                         # 공격 시험 (서버를 띄우지 않아도 된다)
```

## 동기화

| 언제 | 누구를 |
|---|---|
| 로그인 직후 | 그 학생 |
| 화면을 열었는데 6시간 넘게 묵었을 때 | 그 학생 (뒤에서) |
| `지금 동기화` 버튼 | 그 학생 |
| 크론, 매시 13분 | 가장 오래 안 돈 5명 |

크론이 한 번에 5명만 도는 것은 무료 플랜의 호출당 한도 때문이다. 하루 120명까지는 그대로 된다.

## 고장 나면

```bash
# 로그인한 브라우저에서
https://<주소>/api/status
```

`ok: 0` 에 "다시 로그인해 주세요"가 보이면 그 학생의 달력 주소가 죽은 것이다(비밀번호 변경).
로그아웃 후 다시 로그인하면 풀린다.

**로그인 자체가 전원 안 되면** 이캠퍼스가 로그인 폼이나 달력 내보내기 페이지를 바꾼 것이다.
`worker.js` 의 `ecampusLogin()` 이 그 페이지 모양에 기대고 있다. 학교가 직접 로그인을 막고
SSO 만 남기면 이 방식은 더 못 쓴다 — 그때는 학교와 협의하는 길밖에 없다.

## 서버가 있어도 안 되는 것

교수님이 이캠퍼스에 일정을 등록하지 않은 과제는 여전히 안 뜬다. 받아올 데이터 자체가 없다.
동영상 진도율·제출 여부도 달력에는 없다.
