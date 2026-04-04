-- Add dedicated service media columns so detail images are persisted in DB
alter table public.services
  add column if not exists img text,
  add column if not exists detail_image_1 text,
  add column if not exists detail_image_2 text,
  add column if not exists captions jsonb default '{}'::jsonb;

-- Backfill from existing captions when possible
update public.services
set
  detail_image_1 = coalesce(detail_image_1, captions->>'image1'),
  detail_image_2 = coalesce(detail_image_2, captions->>'image2')
where captions is not null;
