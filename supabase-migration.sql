-- ============================================================
-- StudyPact migration — run this in your Supabase SQL editor
-- ============================================================

-- 1. Queue: add UPDATE policy so upsert works if needed in future
drop policy if exists "update own queue entry" on queue;
create policy "update own queue entry" on queue
  for update
  using  (exists (select 1 from users u where u.auth_id = auth.uid() and u.id = user_id))
  with check (exists (select 1 from users u where u.auth_id = auth.uid() and u.id = user_id));


-- 2. Auto-create public.users profile whenever a new auth.users row is created.
--    Handles Google OAuth (username derived from email) and email signups
--    (username read from raw_user_meta_data set during supabase.auth.signUp).
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_email          text;
  v_username       text;
  v_base           text;
  v_school         text;
  v_school_verified boolean;
  v_suffix         integer := 0;
begin
  v_email := new.email;

  -- prefer the username supplied in user metadata (email signups pass it)
  v_username := new.raw_user_meta_data->>'username';

  if v_username is null or length(v_username) < 3 then
    -- derive from email local-part, keep only alphanumeric + underscore
    v_base := lower(regexp_replace(split_part(v_email, '@', 1), '[^a-z0-9_]', '', 'g'));
    if length(v_base) < 3 then v_base := 'user'; end if;
    v_username := v_base;
  end if;

  v_base := v_username;

  -- resolve collisions
  while exists (select 1 from public.users where username = v_username) loop
    v_suffix   := v_suffix + 1;
    v_username := v_base || v_suffix::text;
  end loop;

  -- detect .edu school
  v_school          := substring(v_email from '@([^.]+\.edu)$');
  v_school_verified := v_school is not null;

  insert into public.users (auth_id, email, username, school, school_verified)
  values (new.id, v_email, v_username, v_school, v_school_verified)
  on conflict (auth_id) do nothing;

  return new;
end;
$$;

-- attach trigger (drop first so re-running is safe)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();


-- 3. Sync user XP automatically after any xp_events insert.
--    Runs as SECURITY DEFINER so it can update any user's row,
--    solving the cross-user RLS problem.
create or replace function sync_user_xp()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_total integer;
  v_level integer := 1;
begin
  select coalesce(sum(amount), 0) into v_total
  from xp_events
  where user_id = new.user_id;

  v_total := greatest(0, v_total);

  -- mirrors levelThresholds in xp.js: [0,100,250,500,1000,1750,2750,4000,5500,7500,10000]
  if    v_total >= 10000 then v_level := 11;
  elsif v_total >=  7500 then v_level := 10;
  elsif v_total >=  5500 then v_level := 9;
  elsif v_total >=  4000 then v_level := 8;
  elsif v_total >=  2750 then v_level := 7;
  elsif v_total >=  1750 then v_level := 6;
  elsif v_total >=  1000 then v_level := 5;
  elsif v_total >=   500 then v_level := 4;
  elsif v_total >=   250 then v_level := 3;
  elsif v_total >=   100 then v_level := 2;
  end if;

  update public.users
  set xp = v_total, level = v_level
  where id = new.user_id;

  return new;
end;
$$;

drop trigger if exists on_xp_event_insert on xp_events;
create trigger on_xp_event_insert
  after insert on xp_events
  for each row execute function sync_user_xp();


-- 4. bump_streak: updates streak + last_session_date + sessions_completed for any user.
--    Called via supabase.rpc('bump_streak', { p_user_id: '...' }).
create or replace function bump_streak(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user   record;
  v_today  text := current_date::text;
  v_yest   text := (current_date - 1)::text;
  v_streak integer;
begin
  select streak, last_session_date, sessions_completed
  into v_user
  from public.users
  where id = p_user_id;

  if not found then return; end if;

  v_streak := coalesce(v_user.streak, 0);

  if v_user.last_session_date::text = v_today then
    -- same day — no change
  elsif v_user.last_session_date::text = v_yest then
    v_streak := v_streak + 1;
  else
    v_streak := 1;
  end if;

  update public.users
  set streak              = v_streak,
      last_session_date   = current_date,
      sessions_completed  = coalesce(v_user.sessions_completed, 0) + 1
  where id = p_user_id;

  -- streak-bonus XP every 3 days (trigger on xp_events handles the user.xp sync)
  if v_streak > 0 and v_streak % 3 = 0 then
    insert into xp_events (user_id, amount, reason)
    values (p_user_id, 25, 'streak_bonus');
  end if;
end;
$$;
