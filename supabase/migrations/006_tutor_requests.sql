-- Migration 006: Tutor Requests
-- Allows students to submit in-app tutor requests

create table if not exists tutor_requests (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references profiles(id) on delete cascade,
  tutor_id       uuid not null references tutors(id) on delete cascade,
  subject        text not null,
  message        text,
  preferred_days text[] not null default '{}',
  status         text not null default 'pending'
                   check (status in ('pending', 'accepted', 'declined')),
  created_at     timestamptz not null default now()
);

alter table tutor_requests enable row level security;

-- Students see only their own requests
create policy "students_select_own_requests"
  on tutor_requests for select
  to authenticated
  using (student_id = auth.uid());

-- Students submit their own requests
create policy "students_insert_requests"
  on tutor_requests for insert
  to authenticated
  with check (student_id = auth.uid());
