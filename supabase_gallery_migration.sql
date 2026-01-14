-- Add gallery column to projects
alter table projects add column if not exists gallery text[] default array[]::text[];
