-- Run this in your Supabase SQL editor after 001_profiles.sql

create table if not exists public.devotionals (
  id             uuid        default gen_random_uuid() primary key,
  title          text        not null,
  body           text        not null,
  scripture_ref  text,
  scripture_text text,
  type           text        not null default 'daily'
                   check (type in ('daily', 'weekly')),
  published_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

alter table public.devotionals enable row level security;

create policy "Authenticated users can read devotionals"
  on public.devotionals for select
  using (auth.role() = 'authenticated');

-- Seed: 5 sample devotionals for GBA student-athletes
insert into public.devotionals (title, body, scripture_ref, scripture_text, type, published_at)
values
  (
    'Run Your Race',
    E'Every athlete understands what it means to run a race. You train for months, push through pain, and show up on game day. But Hebrews reminds us that the race we are called to run is bigger than any field or court.\n\nThe writer says to throw off everything that hinders. For an athlete, that might mean pride that keeps you from taking coaching. Or anger that gets you out of position. Or fear of failure that keeps you from giving everything.\n\nThe witnesses surrounding you are not just your teammates — they are every believer who ran faithfully before you. You are not running alone. And the race marked out for you is the one God designed for you specifically — not your teammate''s race, not your older brother''s race. Yours.\n\nRun it with perseverance. Show up to practice when it''s hard. Lead your team even when you don''t feel like it. Trust the Coach who sees further down the track than you do.',
    'Hebrews 12:1',
    'Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us.',
    'weekly',
    now() - interval '7 days'
  ),
  (
    'Strength for Today',
    E'Philippians 4:13 is one of the most quoted verses in sports — and one of the most misunderstood. Paul isn''t promising that God will help you win every game or earn a scholarship. He is saying something deeper: whatever situation I am in, God gives me the strength to stand.\n\nPaul wrote this from prison. Not from a championship podium. He had learned to be content when things were going well and when they weren''t. That kind of strength — the kind that holds you together when you get injured, when you lose, when your senior season doesn''t go the way you planned — that is what Christ provides.\n\nToday, before practice, before your first class, before the pressure of the day settles in — ask God for strength for today. Not for the whole season. Just for today.\n\nHe is enough for today.',
    'Philippians 4:13',
    'I can do all this through him who gives me strength.',
    'daily',
    now() - interval '2 days'
  ),
  (
    'Lead with Character',
    E'Paul asks a sharp question: if everyone is running, who wins? Only one. So why run? Because the point is not just to finish — it is about how you compete.\n\nAthletes who compete with discipline and purpose understand something the crowd often misses. They are not just going through drills. They are building something in themselves. Every rep, every film session, every ice bath — it is forming the kind of person you are becoming.\n\nPaul says he does not run aimlessly or shadowbox. He has a direction. He has a purpose. Do you know yours? Why do you play? Who are you playing for?\n\nWhen you compete with that clarity — when your character on the field matches who you want to be off it — you are no longer just an athlete. You are a leader. And leaders change teams, locker rooms, schools, and eventually communities.',
    '1 Corinthians 9:24-25',
    'Do you not know that in a race all the runners run, but only one gets the prize? Run in such a way as to get the prize. Everyone who competes in the games goes into strict training.',
    'weekly',
    now() - interval '14 days'
  ),
  (
    'First Things First',
    E'What is the first thing you do in the morning before a big game? Many athletes have routines — what you eat, how you warm up, what music you listen to. Routines are powerful because they prepare you to compete.\n\nJesus is talking about a different kind of first thing. He is saying: before you worry about your stats, your playing time, your college options, your relationships — seek the Kingdom first. Make connection with God the anchor of your day.\n\nWhen that is in place, Jesus says, everything else gets added. Not necessarily a scholarship or a championship — but the things you truly need. Peace under pressure. Clarity in decisions. Relationships that last.\n\nToday, put God first. Make it the habit before the habit. Then go compete.',
    'Matthew 6:33',
    'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    'daily',
    now() - interval '1 day'
  ),
  (
    'Better Together',
    E'Every great team has a moment when they realize they are better together than apart. Maybe it is when a starter goes down with an injury and the backup steps up because the team around him lifts him. Or when a losing streak finally breaks because the team stopped playing for themselves and started playing for each other.\n\nEcclesiastes captures this with simple truth: two are better than one. If one falls, the other lifts him up. But woe to the one who is alone when he falls.\n\nYour team is not just a collection of players wearing the same jersey. It is a group of people God placed in your life for this season. They will see you at your worst — tired, frustrated, struggling. And you will see them the same way.\n\nBe the kind of teammate who lifts. Be quick to encourage, slow to criticize. Stay after practice to check on someone who had a hard day. That is not weakness — that is leadership.\n\nYou are better together.',
    'Ecclesiastes 4:9-10',
    'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.',
    'daily',
    now()
  );
