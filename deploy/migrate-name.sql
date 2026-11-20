-- users 에 이름 칸을 넣는다. 2026-11-13 전에 만든 DB 에 한 번만 돌린다.
--   wrangler d1 execute deadline --remote --file=migrate-name.sql
-- 코드보다 먼저 돌린다. 코드를 먼저 올리면 name 을 못 찾아 전부 500 이 난다.
ALTER TABLE users ADD COLUMN name TEXT;
