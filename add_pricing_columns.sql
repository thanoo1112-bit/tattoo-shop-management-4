-- Add new pricing and size columns to appointments table
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS size_w numeric,
ADD COLUMN IF NOT EXISTS size_h numeric,
ADD COLUMN IF NOT EXISTS size_tier text,
ADD COLUMN IF NOT EXISTS estimated_price_range text;
