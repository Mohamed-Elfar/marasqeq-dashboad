-- Seed services based on website data
-- Safe to run multiple times only if you clear duplicates manually or add unique constraints.

-- 1) Ensure category exists (services: buying)
INSERT INTO public.categories (id, name, type, visible, order_index)
SELECT gen_random_uuid(), 'buying', 'services', true, 1
WHERE NOT EXISTS (
  SELECT 1
  FROM public.categories
  WHERE lower(name) = 'buying' AND type = 'services'
);

-- 2) Insert service rows (only when category_id resolves)
WITH seed AS (
  SELECT *
  FROM (
    VALUES
      (
        'Real Estate Investment',
        'We identify and develop strategic investment opportunities that deliver real returns and sustainable growth.',
        'Maraseq Group focuses on exploring and developing real estate investment opportunities while fostering partnerships with investors. Through understanding market dynamics and emerging opportunities, we aim to contribute to sustainable value and long-term growth in the real estate sector.',
        'flaticon-house',
        '21.jpg',
        'buying',
        true,
        true,
        1
      ),
      (
        'Real Estate Marketing',
        'Supporting the promotion of real estate projects and connecting them with potential clients.',
        'Maraseq Group supports the promotion and visibility of real estate projects by connecting opportunities with potential clients and investors. Through structured marketing approaches, we aim to help projects reach the right audience and enhance their presence in the market.',
        'flaticon-house-3',
        '21.jpg',
        'buying',
        true,
        true,
        2
      ),
      (
        'Opportunity Development',
        'We explore emerging opportunities and build strong partnerships to turn them into scalable projects.',
        'Maraseq Group works on discovering new real estate opportunities and building collaborations with developers and investors. By identifying potential projects and aligning interests, we aim to contribute to the development of valuable initiatives within the market.',
        'flaticon-deal-1',
        '21.jpg',
        'buying',
        true,
        true,
        3
      )
  ) AS t(
    title,
    meta_description,
    description,
    icon,
    featured_image,
    category_name,
    featured,
    visible,
    order_index
  )
),
resolved AS (
  SELECT
    s.*,
    c.id AS category_id
  FROM seed s
  LEFT JOIN public.categories c
    ON lower(c.name) = lower(s.category_name)
   AND c.type = 'services'
)
INSERT INTO public.services (
  id,
  title,
  description,
  icon,
  featured_image,
  price,
  category_id,
  featured,
  meta_title,
  meta_description,
  visible,
  order_index
)
SELECT
  gen_random_uuid(),
  r.title,
  r.description,
  r.icon,
  r.featured_image,
  NULL::numeric,
  r.category_id,
  r.featured,
  r.title,
  r.meta_description,
  r.visible,
  r.order_index
FROM resolved r
WHERE r.category_id IS NOT NULL;
