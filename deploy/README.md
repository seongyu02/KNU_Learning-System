# 완전 무인 배포 — Cloudflare Workers

혼자 쓰는 마감 계기판을 서버에 올린다. 올리고 나면 **붙여넣기 단계가 사라진다.**
6시간마다 서버가 알아서 이캠퍼스 일정을 받아 반영한다.

## 왜 서버가 있으면 풀리나

브라우저는 이캠퍼스에 직접 못 붙는다. 달력 URL이 인증 토큰이라 페이지에 넣으면 유출이고,
외부 도메인 요청도 막혀 있다. **서버는 둘 다 해당이 없다.** 토큰을 서버가 들고, 서버가 받아온다.

## 화면은 한 벌만 관리한다

`../내과제/웹앱.html` 이 원본이다. Claude 아티팩트와 이 Worker가 **같은 파일**을 쓴다.
Worker가 `claude.use("db")` 와 같은 모양의 어댑터를 주입해서, 화면 코드는 자기가
어디서 도는지 모른다. 화면을 두 벌로 갈라 관리하면 한쪽만 고치는 일이 반드시 생긴다.

## 배포된 주소

```
https://deadline-dashboard.a92875664.workers.dev
```

`APP_TOKEN` 은 `내과제/.env.local` 에 있다 (커밋되지 않는다).
처음 한 번 `…/login?t=<APP_TOKEN>` 을 열면 쿠키가 박혀서, 그다음부터는 주소만 치면 된다.

| 항목 | 값 |
|---|---|
| D1 데이터베이스 | `deadline` (APAC) |
| 크론 | `17 */6 * * *` — 6시간마다 |
| 첫 동기화 | 2026-09-24 · 15건 수집 (과제 4 / 강의 11) |

## 배포 순서 (처음부터 다시 할 때)

사전 준비: Cloudflare 계정(무료), Node.js.

```bash
npm install -g wrangler
wrangler login
```

**1. 데이터베이스 만들기**

```bash
cd deploy
wrangler d1 create deadline
```

출력에 나오는 `database_id` 를 `wrangler.toml` 의 `PUT_YOUR_D1_DATABASE_ID_HERE` 자리에 넣는다.

```bash
wrangler d1 execute deadline --remote --file=schema.sql
```

**2. 비밀값 넣기**

```bash
wrangler secret put ICS_URL      # 내과제/.env.local 에 있는 그 URL
wrangler secret put APP_TOKEN    # 나 — 보기 + 고치기
wrangler secret put VIEW_TOKEN   # 남에게 줄 링크 — 보기만
```

**토큰이 두 개인 이유.** `APP_TOKEN` 링크를 남에게 주면 완료 체크·삭제·추가가 다 된다.
채점하는 사람이 실수로 눌러도 내 데이터가 바뀐다. `VIEW_TOKEN` 으로 열면
화면이 편집 손잡이를 스스로 감추고, 서버도 쓰기 요청을 **403** 으로 막는다.

| | `APP_TOKEN` | `VIEW_TOKEN` |
|---|---|---|
| 화면 보기 · 목록 읽기 | 200 | 200 |
| 완료 체크 · 추가 · 삭제 | 200 | **403** |
| 지금 동기화 | 200 | **403** |

> 두 값 모두 저장소에 커밋되지 않는다. Cloudflare 가 암호화해 보관한다.
> `ICS_URL` 은 내 일정 전체를 읽는 열쇠다. 남에게 주지 않는다.

**3. 화면 복사하고 올리기**

```bash
python build.py
wrangler deploy
```

**4. 첫 동기화**

```
https://deadline-dashboard.a92875664.workers.dev/login?t=<APP_TOKEN>
```

한 번 열면 쿠키가 박혀서 그다음부터는 주소만 치면 된다. 폰 홈화면에 추가해도 된다.
첫 데이터는 크론을 기다리지 말고 한 번 당겨온다.

```bash
curl -X POST -H "cookie: dd_token=<APP_TOKEN>" \
  https://deadline-dashboard.a92875664.workers.dev/api/sync
```

## 잠금

`APP_TOKEN` 을 모르면 아무것도 안 보인다(401). 혼자 쓰는 용도로는 이걸로 충분하다.
더 단단히 잠그려면 **Cloudflare Access**(50명까지 무료)를 붙여 본인 이메일만
통과시키면 된다. 코드는 그대로 두고 대시보드에서 설정한다.

## 비용

무료 티어 안에서 끝난다. 크론이 하루 4번, 조회가 하루 몇 번이다.
Workers 는 하루 10만 요청, D1 은 하루 500만 행 읽기까지 무료다.

## 고장 나면

가장 흔한 고장은 **달력 URL 만료**다. 조용히 깨지면 며칠 뒤에야 알아차리므로
실행 이력을 남긴다.

```bash
curl -H "cookie: dd_token=<APP_TOKEN>" \
  https://deadline-dashboard.a92875664.workers.dev/api/status
```

`ok: 0` 에 `HTTP 403` 같은 메시지가 보이면 이캠퍼스에서 달력 URL을 다시 받아
`wrangler secret put ICS_URL` 로 갈아끼운다.

## 서버가 있어도 안 되는 것

**디지털트윈프로그래밍 · 단기 K-프로젝트I 은 여전히 안 뜬다.**
교수님이 이캠퍼스에 일정을 등록하지 않으면 받아올 데이터 자체가 없다.
이건 서버로 못 고친다. 이 시스템 자동화의 천장이고, 주 1회 수동 확인이 필요하다.

## 남이 쓰게 하려면

지금 구조는 **한 사람 전용**이다. 남에게 열려면 성격이 바뀐다.

- 남의 달력 URL을 우리가 보관하는 순간 개인정보 처리자가 된다 — 암호화·유출대응·탈퇴시 삭제가 의무
- 제3자 서비스가 여러 학생의 LMS 데이터를 정기 수집하는 건 학교와 협의가 필요한 영역
- `APP_TOKEN` 하나짜리 잠금으로는 부족하고 계정 체계가 필요하다

기술보다 이쪽이 실제 장벽이다.
