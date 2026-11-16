-- =============================================================
--  Автоматичні тривоги з alerts.in.ua (виконай ПІСЛЯ setup.sql)
--  Supabase → SQL Editor → New query → встав → заміни СЕКРЕТ → Run
-- =============================================================

-- 1) Позначка, звідки тривога: з адмінки чи автоматично
alter table public.alerts add column if not exists source text not null default 'manual';

-- 2) Планувальник і HTTP-запити з бази
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3) Щохвилини викликати функцію sync-alerts
select cron.unschedule(jobid) from cron.job where jobname = 'sync-alerts';
select cron.schedule(
  'sync-alerts',
  '* * * * *',
  $$
  select net.http_post(
    url     := 'https://gdxprbovnbyxsldnmxvn.supabase.co/functions/v1/sync-alerts',
    headers := '{"Content-Type":"application/json","x-cron-secret":"СЕКРЕТ"}'::jsonb,
    body    := '{}'::jsonb
  );
  $$
);

-- Перевірити, що завдання є:     select jobname, schedule from cron.job;
-- Подивитися останні відповіді:  select status_code, content from net._http_response order by created desc limit 5;
-- Вимкнути автотривоги:          select cron.unschedule('sync-alerts');
