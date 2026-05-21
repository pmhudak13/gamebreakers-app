-- Phase 07: Tutor Profiles

create table if not exists public.tutors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  bio           text not null,
  avatar_url    text,
  subjects      text[] not null default '{}',
  grade_levels  text[] not null default '{}',
  availability  text[] not null default '{}',
  rate_type     text not null check (rate_type in ('free', 'paid')),
  rate_note     text,
  contact_email text,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- RLS: any authenticated user can read active tutor profiles
alter table public.tutors enable row level security;

create policy "Authenticated users can view active tutors"
  on public.tutors
  for select
  to authenticated
  using (active = true);

-- Seed data — 8 example tutors
insert into public.tutors (name, bio, subjects, grade_levels, availability, rate_type, rate_note, contact_email) values
  (
    'Marcus Williams',
    'Junior at Warren HS. Scored 1480 on the SAT and love helping teammates nail the test. Strong in Math and Reading comprehension.',
    array['SAT Prep', 'Math'],
    array['10th', '11th', '12th'],
    array['Tue', 'Thu', 'Sat'],
    'free',
    'Free for Warren players',
    'marcus.w@example.com'
  ),
  (
    'Destiny Johnson',
    'AP English and History student with a 4.2 GPA. I break down essays and writing assignments in a way that actually makes sense.',
    array['English', 'History'],
    array['9th', '10th', '11th'],
    array['Mon', 'Wed', 'Fri'],
    'free',
    'Free — just DM me',
    'destiny.j@example.com'
  ),
  (
    'Elijah Carter',
    'Pre-calc and Physics are my thing. I use sports analogies to explain concepts — makes everything click faster.',
    array['Math', 'Science'],
    array['10th', '11th', '12th'],
    array['Mon', 'Wed'],
    'paid',
    '$15/hr',
    'elijah.c@example.com'
  ),
  (
    'Aaliyah Brooks',
    'College sophomore studying Biology. I tutor Science and help students prepare for AP exams with practice sets and breakdowns.',
    array['Science', 'Biology'],
    array['9th', '10th', '11th', '12th'],
    array['Sat', 'Sun'],
    'paid',
    '$20/hr',
    'aaliyah.b@example.com'
  ),
  (
    'Jordan Reed',
    'Former Warren player now at community college. I know how tough it is to balance school and sports — here to help with writing and study skills.',
    array['English', 'Study Skills'],
    array['9th', '10th'],
    array['Tue', 'Thu'],
    'free',
    'Free for GBA students',
    'jordan.r@example.com'
  ),
  (
    'Simone Davis',
    'Math nerd who tutored 12 students last year with an average grade improvement of a full letter grade. Algebra through Calculus.',
    array['Math', 'SAT Prep'],
    array['9th', '10th', '11th', '12th'],
    array['Mon', 'Tue', 'Thu'],
    'paid',
    '$18/hr',
    'simone.d@example.com'
  ),
  (
    'Caleb Thompson',
    'Passionate about faith and academics. Happy to help with Bible study, essay writing, and keeping your priorities straight.',
    array['Bible Study', 'English'],
    array['9th', '10th', '11th', '12th'],
    array['Wed', 'Fri', 'Sun'],
    'free',
    'Always free',
    'caleb.t@example.com'
  ),
  (
    'Naomi Scott',
    'Chemistry and Biology specialist. Going into nursing and love making science real and relevant for athletes.',
    array['Science', 'Chemistry'],
    array['10th', '11th', '12th'],
    array['Tue', 'Sat'],
    'paid',
    '$20/hr',
    'naomi.s@example.com'
  );
