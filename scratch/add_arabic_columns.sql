-- Migration: Add Arabic columns for text fields
-- Date: 2026-05-08

-- public.properties
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS title_ar character varying,
ADD COLUMN IF NOT EXISTS description_ar text,
ADD COLUMN IF NOT EXISTS location_ar character varying,
ADD COLUMN IF NOT EXISTS property_type_ar character varying,
ADD COLUMN IF NOT EXISTS meta_title_ar character varying,
ADD COLUMN IF NOT EXISTS meta_description_ar text,
ADD COLUMN IF NOT EXISTS path_description_ar text,
ADD COLUMN IF NOT EXISTS ideal_for_ar text,
ADD COLUMN IF NOT EXISTS recommended_label_ar character varying,
ADD COLUMN IF NOT EXISTS opportunity_type_ar character varying,
ADD COLUMN IF NOT EXISTS opportunity_stage_ar character varying,
ADD COLUMN IF NOT EXISTS short_description_ar text,
ADD COLUMN IF NOT EXISTS full_description_ar text,
ADD COLUMN IF NOT EXISTS objective_ar text;

-- public.categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS name_ar character varying,
ADD COLUMN IF NOT EXISTS description_ar text;

-- public.news
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS title_ar character varying,
ADD COLUMN IF NOT EXISTS excerpt_ar text,
ADD COLUMN IF NOT EXISTS content_ar text,
ADD COLUMN IF NOT EXISTS meta_title_ar character varying,
ADD COLUMN IF NOT EXISTS meta_description_ar text;

-- public.portfolio
ALTER TABLE public.portfolio 
ADD COLUMN IF NOT EXISTS title_ar character varying,
ADD COLUMN IF NOT EXISTS description_ar text,
ADD COLUMN IF NOT EXISTS project_type_ar character varying,
ADD COLUMN IF NOT EXISTS client_ar character varying,
ADD COLUMN IF NOT EXISTS meta_title_ar character varying,
ADD COLUMN IF NOT EXISTS meta_description_ar text,
ADD COLUMN IF NOT EXISTS designation_ar text,
ADD COLUMN IF NOT EXISTS short_description_ar text,
ADD COLUMN IF NOT EXISTS full_description_ar text,
ADD COLUMN IF NOT EXISTS filter_ar text;

-- public.form_options
ALTER TABLE public.form_options 
ADD COLUMN IF NOT EXISTS label_ar character varying;

-- public.contact_info
ALTER TABLE public.contact_info 
ADD COLUMN IF NOT EXISTS label_ar character varying;

-- public.social_links
ALTER TABLE public.social_links 
ADD COLUMN IF NOT EXISTS name_ar character varying;

-- public.pages
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS title_ar character varying,
ADD COLUMN IF NOT EXISTS meta_title_ar character varying,
ADD COLUMN IF NOT EXISTS meta_description_ar text;

-- public.faqs
ALTER TABLE public.faqs 
ADD COLUMN IF NOT EXISTS question_ar text,
ADD COLUMN IF NOT EXISTS answer_ar text,
ADD COLUMN IF NOT EXISTS category_ar text;

-- public.services
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS title_ar character varying,
ADD COLUMN IF NOT EXISTS description_ar text,
ADD COLUMN IF NOT EXISTS meta_title_ar character varying,
ADD COLUMN IF NOT EXISTS meta_description_ar text;

-- public.partners
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS name_ar character varying;

-- public.brands
ALTER TABLE public.brands 
ADD COLUMN IF NOT EXISTS alt_text_ar text;
