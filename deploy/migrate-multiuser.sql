-- 1인용 DB 를 다중 사용자 구조로 옮긴다. **한 번만** 돌린다. 두 번 돌리면 첫 줄에서 멈춘다.
--   wrangler d1 execute deadline --remote --file=migrate-multiuser.sql
--   wrangler d1 execute deadline --remote --file=schema.sql      (users·sessions·login_fail 을 만든다)
--
-- 지금까지 쌓인 데이터는 user_id='legacy' 로 옮겨 둔다. OWNER_ID 비밀값에 적힌 학번이
-- 처음 로그인하는 순간 Worker 가 그 계정으로 넘긴다. 학번을 이 파일에 적지 않으려는 것이다.

ALTER TABLE items RENAME TO items_v1;
ALTER TABLE sync_log RENAME TO sync_log_v1;
ALTER TABLE logs RENAME TO logs_v1;
DROP INDEX IF EXISTS items_due;

CREATE TABLE items (
  user_id   TEXT NOT NULL,
  id        TEXT NOT NULL,
  title     TEXT NOT NULL,
  course    TEXT NOT NULL,
  kind      TEXT NOT NULL,
  due       TEXT NOT NULL,
  dueTime   TEXT,
  closes    TEXT,
  estimate  REAL,
  status    TEXT NOT NULL DEFAULT '미착수',
  source    TEXT NOT NULL DEFAULT '자동',
  note      TEXT NOT NULL DEFAULT '',
  updatedAt TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);
CREATE INDEX items_user_due ON items(user_id, due);

CREATE TABLE sync_log (
  user_id TEXT NOT NULL,
  at      TEXT NOT NULL,
  ok      INTEGER NOT NULL,
  found   INTEGER NOT NULL DEFAULT 0,
  added   INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (user_id, at)
);

CREATE TABLE logs (
  user_id   TEXT NOT NULL,
  id        TEXT NOT NULL,
  body      TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);

INSERT INTO items (user_id,id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt)
  SELECT 'legacy',id,title,course,kind,due,dueTime,closes,estimate,status,source,note,updatedAt FROM items_v1;
INSERT INTO sync_log (user_id,at,ok,found,added,message)
  SELECT 'legacy',at,ok,found,added,message FROM sync_log_v1;
INSERT INTO logs (user_id,id,body,updatedAt)
  SELECT 'legacy',id,body,updatedAt FROM logs_v1;

DROP TABLE items_v1;
DROP TABLE sync_log_v1;
DROP TABLE logs_v1;
