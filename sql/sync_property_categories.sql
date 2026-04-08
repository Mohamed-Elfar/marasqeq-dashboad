-- Sync property categories and clear existing property-category assignments.
-- Run this in Supabase SQL Editor.

begin;

-- 1) Remove existing categories of type 'properties' so only the required list remains.
delete from public.categories
where type = 'properties';

-- 2) Insert required property categories.
insert into public.categories (name, description, type, image_url, visible, order_index)
values
  ('Office', '-', 'properties', null, true, 1),
  ('Duplex House', '-', 'properties', null, true, 2),
  ('Compound Path', '-', 'properties', null, true, 3),
  ('Villas Path', '-', 'properties', null, true, 4),
  ('Apartments', '-', 'properties', null, true, 5);

-- 3) Clear category assignments from properties (supports common column types).
do $$
declare
  category_data_type text;
  category_udt_name text;
begin
  select c.data_type, c.udt_name
    into category_data_type, category_udt_name
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'properties'
    and c.column_name = 'category';

  if category_data_type is null then
    raise notice 'public.properties.category column was not found; skipping property category cleanup.';
    return;
  end if;

  if category_data_type = 'ARRAY' then
    execute 'update public.properties set category = ARRAY[]::text[] where category is not null';
  elsif category_udt_name = 'jsonb' then
    execute 'update public.properties set category = ''[]''::jsonb where category is not null';
  elsif category_udt_name = 'json' then
    execute 'update public.properties set category = ''[]''::json where category is not null';
  else
    execute 'update public.properties set category = null where category is not null';
  end if;
end $$;

commit;
