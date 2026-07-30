create table if not exists public.career_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  task_one text not null,
  task_two text not null,
  rating smallint not null check (rating between 1 and 5),
  satisfaction_note text,
  created_at timestamptz not null default now()
);

alter table public.career_submissions enable row level security;

drop policy if exists "allow anonymous career submissions" on public.career_submissions;
create policy "allow anonymous career submissions"
on public.career_submissions
for insert
to anon, authenticated
with check (true);

grant insert on table public.career_submissions to anon, authenticated;
revoke select, update, delete on table public.career_submissions from anon, authenticated;
