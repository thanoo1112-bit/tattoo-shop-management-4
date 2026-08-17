-- Add new columns for Smart Dual Size Selector to the appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS width numeric,
ADD COLUMN IF NOT EXISTS length numeric,
ADD COLUMN IF NOT EXISTS size_tier text,
ADD COLUMN IF NOT EXISTS estimated_price text;
