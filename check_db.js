const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ophjlnvbnmsybizjbopz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGpsbnZibm1zeWJpempib3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzQ1MjgsImV4cCI6MjEwMTk1MDUyOH0.8om9woWtMtqweRuH5XdcsxHpUtHNo62_D-QFoNBqxyw'
);

async function checkDb() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const { data: artists } = await supabase.from('artists').select('*');
  
  console.log("=== PROFILES ===");
  console.table(profiles);
  
  console.log("\n=== ARTISTS ===");
  console.table(artists);
}

checkDb();
