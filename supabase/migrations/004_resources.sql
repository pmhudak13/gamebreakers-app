create table if not exists public.resources (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null,
  url           text not null,
  category      text not null check (category in ('faith','fitness','academics','life')),
  resource_type text not null check (resource_type in ('article','video','podcast','tool')),
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "resources_select_active" on public.resources
  for select using (active = true);

-- ── Seed data ────────────────────────────────────────────────────────────────

insert into public.resources (title, description, url, category, resource_type) values

  -- Faith
  ('YouVersion Bible App',
   'Daily Bible reading plans, devotionals, and the full Bible in hundreds of translations.',
   'https://www.youversion.com', 'faith', 'tool'),

  ('I Am Second',
   'Real stories from athletes, celebrities, and everyday people about their faith journey.',
   'https://www.iamsecond.com', 'faith', 'video'),

  ('Cru — Train & Grow',
   'Faith resources, Bible studies, and student community connections at your school.',
   'https://www.cru.org/us/en/train-and-grow.html', 'faith', 'article'),

  -- Fitness
  ('Nike Training Club',
   'Free workout plans for every level — strength, endurance, and mobility for athletes.',
   'https://www.nike.com/ntc-app', 'fitness', 'tool'),

  ('NSCA Youth Resistance Training',
   'Science-backed strength and conditioning principles designed specifically for high school athletes.',
   'https://www.nsca.com/education/articles/youth-resistance-training/', 'fitness', 'article'),

  ('Headspace for Sport',
   'Meditation and mindfulness techniques built for sports performance, focus, and recovery.',
   'https://www.headspace.com/sports', 'fitness', 'tool'),

  -- Academics
  ('Khan Academy',
   'Free world-class education for any subject — perfect for SAT/ACT prep and everyday homework help.',
   'https://www.khanacademy.org', 'academics', 'tool'),

  ('Fastweb Scholarship Search',
   'Find scholarships matched to your profile. Student-athletes have access to thousands of opportunities.',
   'https://www.fastweb.com', 'academics', 'tool'),

  ('Cornell Note-Taking System',
   'Proven note-taking strategies from Cornell University to maximize retention and study efficiency.',
   'https://lsc.cornell.edu/how-to-study/taking-notes/cornell-note-taking-system/', 'academics', 'article'),

  -- Life Skills
  ('Practical Money Skills',
   'Budgeting, saving, and money management basics built for high school students.',
   'https://www.practicalmoneyskills.com/en/learn/get_started/students.html', 'life', 'article'),

  ('Indeed Resume Builder',
   'Step-by-step resume builder used by millions — create a professional resume for free.',
   'https://www.indeed.com/create-resume', 'life', 'tool'),

  ('Crisis Text Line',
   'Free, 24/7 mental health support. Text HOME to 741741 to connect with a trained counselor anytime.',
   'https://www.crisistextline.org', 'life', 'article');
