-- 마감 계기판 저장소 (Cloudflare D1)
--   wrangler d1 execute deadline --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS items (
  id        TEXT PRIMARY KEY,   -- 마감일8자리_FNV1a해시8자리. 파이썬·JS 가 같은 값을 낸다
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
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS items_due ON items(due);
-- 이미 만든 DB 에는 한 번만:
--   wrangler d1 execute deadline --remote --command "ALTER TABLE items ADD COLUMN closes TEXT"

-- 동기화 실행 이력. 조용히 깨지는 걸 막으려고 남긴다.
CREATE TABLE IF NOT EXISTS sync_log (
  at      TEXT PRIMARY KEY,
  ok      INTEGER NOT NULL,
  found   INTEGER NOT NULL DEFAULT 0,
  added   INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL DEFAULT ''
);

-- 하루치 계획. 화면이 만든 JSON 을 통째로 보관한다.
-- 모양이 바뀔 수 있어서 칸을 미리 못 박지 않는다.
CREATE TABLE IF NOT EXISTS logs (
  id        TEXT PRIMARY KEY,   -- YYYY-MM-DD
  body      TEXT NOT NULL,      -- JSON
  updatedAt TEXT NOT NULL
);
