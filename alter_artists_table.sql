-- 1. เพิ่มคอลัมน์ styles เป็นประเภท JSONB เพื่อเก็บ Array ของสไตล์งานสัก
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS styles JSONB DEFAULT '[]'::jsonb;

-- 2. เพิ่มคอลัมน์ style ลงใน appointments (ถ้ายังไม่มี) เพื่อเก็บสไตล์ที่ลูกค้าเลือก
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS style TEXT;
