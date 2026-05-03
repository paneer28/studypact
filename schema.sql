-- StudyPact schema. Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Users (profile table; Supabase Auth provides auth.users separately)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  username text unique not null,
  school text,
  school_verified boolean default false,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_session_date date,
  sessions_completed integer default 0,
  approvals_given integer default 0,
  created_at timestamptz default now()
);

-- Sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references users(id),
  user_b uuid references users(id),
  task_a text,
  task_b text,
  duration_a integer,
  duration_b integer,
  status text default 'active',
  user_a_done boolean default false,
  user_b_done boolean default false,
  user_a_approved boolean default false,
  user_b_approved boolean default false,
  signal_a jsonb,
  signal_b jsonb,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- Messages (in-session chat)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  sender_id uuid references users(id),
  content text not null,
  type text default 'text',
  created_at timestamptz default now()
);

-- Callouts
create table if not exists callouts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  caller_id uuid references users(id),
  target_id uuid references users(id),
  resolved boolean default false,
  created_at timestamptz default now()
);

-- Matchmaking queue
create table if not exists queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) unique,
  school text,
  joined_at timestamptz default now()
);

-- XP transactions
create table if not exists xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  amount integer,
  reason text,
  session_id uuid references sessions(id),
  created_at timestamptz default now()
);

-- Enable Realtime in the dashboard for: sessions, messages, queue, callouts.

-- Row Level Security
alter table users enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table callouts enable row level security;
alter table queue enable row level security;
alter table xp_events enable row level security;

-- users policies
create policy "read all profiles" on users for select using (true);
create policy "update own profile" on users for update using (auth.uid() = auth_id);
create policy "insert own profile" on users for insert with check (auth.uid() = auth_id);

-- sessions policies
create policy "read own sessions" on sessions for select using (
  exists (select 1 from users u where u.auth_id = auth.uid() and (u.id = user_a or u.id = user_b))
);
create policy "update own sessions" on sessions for update using (
  exists (select 1 from users u where u.auth_id = auth.uid() and (u.id = user_a or u.id = user_b))
);
create policy "insert sessions" on sessions for insert with check (true);

-- messages policies
create policy "read own session messages" on messages for select using (
  exists (
    select 1 from sessions s
    join users u on u.auth_id = auth.uid()
    where s.id = messages.session_id and (s.user_a = u.id or s.user_b = u.id)
  )
);
create policy "send own session messages" on messages for insert with check (
  exists (
    select 1 from sessions s
    join users u on u.auth_id = auth.uid()
    where s.id = messages.session_id and (s.user_a = u.id or s.user_b = u.id) and u.id = sender_id
  )
);

-- callouts policies (same pattern as messages)
create policy "read own session callouts" on callouts for select using (
  exists (
    select 1 from sessions s
    join users u on u.auth_id = auth.uid()
    where s.id = callouts.session_id and (s.user_a = u.id or s.user_b = u.id)
  )
);
create policy "send callouts" on callouts for insert with check (
  exists (
    select 1 from sessions s
    join users u on u.auth_id = auth.uid()
    where s.id = callouts.session_id and (s.user_a = u.id or s.user_b = u.id) and u.id = caller_id
  )
);

-- queue policies
create policy "read queue" on queue for select using (true);
create policy "join queue" on queue for insert with check (
  exists (select 1 from users u where u.auth_id = auth.uid() and u.id = user_id)
);
create policy "leave queue" on queue for delete using (
  exists (select 1 from users u where u.auth_id = auth.uid() and u.id = user_id)
);

-- xp_events policies
create policy "read own xp events" on xp_events for select using (
  exists (select 1 from users u where u.auth_id = auth.uid() and u.id = user_id)
);
create policy "insert xp events" on xp_events for insert with check (true);
