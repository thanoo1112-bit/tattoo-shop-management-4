-- Create table for storing admin push subscriptions
CREATE TABLE IF NOT EXISTS public.admin_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_subscriptions ENABLE ROW LEVEL SECURITY;

-- Admins can insert their own subscriptions
CREATE POLICY "Admins can insert their own subscriptions"
ON public.admin_subscriptions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Admins can update their own subscriptions
CREATE POLICY "Admins can update their own subscriptions"
ON public.admin_subscriptions
FOR UPDATE
USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Admins can select their own subscriptions
CREATE POLICY "Admins can select their own subscriptions"
ON public.admin_subscriptions
FOR SELECT
USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Service role (server) can read all subscriptions for pushing notifications
-- Since server uses service_role key, it bypasses RLS anyway, but good to note.
