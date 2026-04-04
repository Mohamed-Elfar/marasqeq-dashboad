-- One-time cleanup for services media model
-- Goal:
-- 1) Ensure dedicated image columns exist
-- 2) Backfill detail_image_1 / detail_image_2 from legacy captions.image1 / captions.image2
-- 3) Remove duplicated image keys from captions, keep only text fields

alter table public.services
  add column if not exists img text,
  add column if not exists detail_image_1 text,
  add column if not exists detail_image_2 text,
  add column if not exists captions jsonb default '{}'::jsonb;

-- Backfill dedicated image columns from legacy captions keys
update public.services
set
  img = nullif(coalesce(img, featured_image, ''), ''),
  detail_image_1 = nullif(coalesce(detail_image_1, captions->>'image1', ''), ''),
  detail_image_2 = nullif(coalesce(detail_image_2, captions->>'image2', ''), '')
where true;

-- Keep captions for text-only details and remove duplicated image keys
update public.services
set captions = jsonb_strip_nulls(
  jsonb_build_object(
    'caption', nullif(captions->>'caption', ''),
    'captionFullDescription', nullif(captions->>'captionFullDescription', ''),
    'captionShortDescription', nullif(captions->>'captionShortDescription', '')
  )
)
where captions is not null;

-- Reload PostgREST schema cache (helps after migrations)
notify pgrst, 'reload schema';

-- Verify result
-- select id, title, featured_image, img, detail_image_1, detail_image_2, captions from public.services order by order_index;
