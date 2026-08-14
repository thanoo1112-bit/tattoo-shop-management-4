import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ophjlnvbnmsybizjbopz.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGpsbnZibm1zeWJpempib3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzQ1MjgsImV4cCI6MjEwMTk1MDUyOH0.8om9woWtMtqweRuH5XdcsxHpUtHNo62_D-QFoNBqxyw'
);

async function testAdminLogin() {
  console.log("Logging in...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin157tattoo@gmail.com',
    password: '159753',
  });

  if (authError) {
    console.error("Login failed:", authError.message);
    return;
  }

  console.log("Login successful! User ID:", authData.user.id);

  console.log("Fetching profile...");
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error("Failed to fetch profile (RLS blocking or missing?):", profileError.message);
  } else {
    console.log("Profile data:", profile);
  }
}

testAdminLogin();
