-- 마감 계기판 저장소 (Cloudflare D1) — 학생마다 따로 담는다
--   새로 만들 때:        wrangler d1 execute deadline --remote --file=schema.sql
--   1인용에서 올라올 때:  wrangler d1 execute deadline --remote --file=migrate-multiuser.sql
--
-- 모든 데이터 표의 열쇠는 (user_id, id) 다. 같은 과목·같은 과제를 듣는 두 학생은
-- id 가 똑같이 나오므로, user_id 없이는 서로의 완료 표시를 덮어쓴다.

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,   -- 이캠퍼스 아이디(학번)
  ics         TEXT NOT NULL,      -- 달력 주소. AES-GCM 으로 잠근 값(iv.암호문). 비밀번호는 어디에도 없다
  name        TEXT,               -- 이캠퍼스에 적힌 이름. 화면 위쪽에 학번 대신 보여 준다. 못 읽으면 비어 있다
  createdAt   TEXT NOT NULL,
  lastLoginAt TEXT NOT NULL,
  lastSyncAt  TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sessions (
  id      TEXT PRIMARY KEY,       -- 세션 토큰의 SHA-256. 원문은 학생 브라우저 쿠키에만 있다
  user_id TEXT NOT NULL,
  expires TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);

-- 틀린 로그인 기록. 비밀번호 찍어 보기를 막는 데만 쓴다. 하루 지나면 크론이 지운다.
CREATE TABLE IF NOT EXISTS login_fail (
  key TEXT NOT NULL,              -- u:<아이디> 또는 i:<IP>
  at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS login_fail_key ON login_fail(key, at);

CREATE TABLE IF NOT EXISTS items (
  user_id   TEXT NOT NULL,
  id        TEXT NOT NULL,      -- 마감일8자리_FNV1a해시8자리. 파이썬·JS 가 같은 값을 낸다
  title     TEXT NOT NULL,
  course    TEXT NOT NULL,
  kind      TEXT NOT NULL,      -- 과제 | 강의
  due       TEXT NOT NULL,      -- YYYY-MM-DD
  dueTime   TEXT,               -- HH:MM. 이캠퍼스는 시각을 안 주므로 보통 비어 있다. "24:00" = 그날 자정
  closes    TEXT,               -- 강의만. 시청이 닫히는 날(DTEND). 강의의 due 는 열리는 날이다
  estimate  REAL,               -- 예상 소요시간(h). 사람이 넣는다. 추정하지 않는다
  status    TEXT NOT NULL DEFAULT '미착수',
  source    TEXT NOT NULL DEFAULT '자동',   -- 자동(iCal) | 수동(직접 등록)
  note      TEXT NOT NULL DEFAULT '',
  updatedAt TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX IF NOT EXISTS items_user_due ON items(user_id, due);

-- 동기화 실행 이력. 조용히 깨지는 걸 막으려고 남긴다. 30일 지나면 크론이 지운다.
CREATE TABLE IF NOT EXISTS sync_log (
  user_id TEXT NOT NULL,
  at      TEXT NOT NULL,
  ok      INTEGER NOT NULL,
  found   INTEGER NOT NULL DEFAULT 0,
  added   INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (user_id, at)
);

-- 하루치 계획. 화면이 만든 JSON 을 통째로 보관한다.
-- 모양이 바뀔 수 있어서 칸을 미리 못 박지 않는다.
CREATE TABLE IF NOT EXISTS logs (
  user_id   TEXT NOT NULL,
  id        TEXT NOT NULL,      -- YYYY-MM-DD
  body      TEXT NOT NULL,      -- JSON
  updatedAt TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);
