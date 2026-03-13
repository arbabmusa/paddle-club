-- Paddle Club Database Schema
-- Run this in Supabase SQL Editor

-- Players table
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Sessions table
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time default '18:00',
  location text default 'Paddle Court',
  status text default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  court_fee numeric,
  created_at timestamptz default now()
);

-- Session players (who's playing in each session)
create table if not exists session_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  paid boolean default false,
  created_at timestamptz default now(),
  unique(session_id, player_id)
);

-- Matches table
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  court_number int default 1,
  round_number int default 1,
  team1_player1 uuid references players(id),
  team1_player2 uuid references players(id),
  team2_player1 uuid references players(id),
  team2_player2 uuid references players(id),
  team1_score int default 0,
  team2_score int default 0,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now()
);

-- Enable Row Level Security (but allow all for now - no auth)
alter table players enable row level security;
alter table sessions enable row level security;
alter table session_players enable row level security;
alter table matches enable row level security;

-- Allow all operations for anonymous users (no auth required)
create policy "Allow all on players" on players for all using (true) with check (true);
create policy "Allow all on sessions" on sessions for all using (true) with check (true);
create policy "Allow all on session_players" on session_players for all using (true) with check (true);
create policy "Allow all on matches" on matches for all using (true) with check (true);

-- Seed initial players
insert into players (name) values
  ('Shabab'),
  ('Muzakker'),
  ('Ashfaque'),
  ('Mahin'),
  ('Saad'),
  ('Junaid'),
  ('Zain'),
  ('Mahir Bhai')
on conflict do nothing;
