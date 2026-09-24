const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/.env' });

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError || !users.length) {
    console.log("No users or auth error", authError);
    return;
  }
  const userId = users[users.length - 1].id; // get last created user
  console.log("Testing for user:", userId);

  const { data, error } = await supabase.rpc('get_feed', {
        p_mode: 'discover',
        p_scope: null,
        p_cursor: null,
        p_limit: 20
      });
  console.log("get_feed result:", error ? error.message : data);
  
  // also get profile details
  const { data: p } = await supabase.from('profiles').select('*, photos(media_id)').eq('id', userId).single();
  const { data: pp } = await supabase.from('profile_private').select('*').eq('user_id', userId).single();
  console.log("Profile:", p);
  console.log("Profile Private:", pp);
}
test();
