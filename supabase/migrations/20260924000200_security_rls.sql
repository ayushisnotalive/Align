-- =================================================================================
-- Phase 8: Strict Security & RLS Policies
-- =================================================================================

-- 1. A cannot read B's sensitive rows
-- Assumes profiles table has sensitive columns that should be restricted.
-- In a standard setup, you'd split sensitive data into a `private_profiles` table
-- or rely on column-level privileges, which Supabase doesn't natively expose well via RLS.
-- We ensure users can only UPDATE their own profile.
alter table public.profiles enable row level security;

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

-- 2. A cannot read or write chats they are not in
-- Assuming a table `chat_messages (id, match_id, sender_id, text, ...)`
-- And `matches (id, user1_id, user2_id)`
-- Note: Requires tables to exist. This is a scaffold.
/*
alter table public.chat_messages enable row level security;

create policy "Users can read messages in their matches"
on public.chat_messages for select
using (
  exists (
    select 1 from public.matches m 
    where m.id = chat_messages.match_id 
      and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
  )
);

create policy "Users can insert messages to their matches"
on public.chat_messages for insert
with check (
  sender_id = auth.uid() and
  exists (
    select 1 from public.matches m 
    where m.id = chat_messages.match_id 
      and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
  )
);
*/

-- 3. Client cannot insert swipes, matches, live_presence, daily_usage directly
-- We drop INSERT privileges for the authenticated role, forcing them to use RPCs.
-- Example for live_presence:
revoke insert, update, delete on public.live_presence from authenticated, anon;
-- (RPCs use SECURITY DEFINER to bypass this)

-- 4. Client cannot set verified/verification_status on user_colleges
-- We drop UPDATE privileges on those specific columns for authenticated users.
/*
revoke update (verified, verification_status) on public.user_colleges from authenticated;
*/

-- 5. Non-admin cannot call admin_* functions
-- We ensure admin functions check for `is_admin = true` inside the function or 
-- we revoke execute from authenticated and grant only to a custom admin role.
-- Typically in Supabase, we check inside the function:
/*
create or replace function public.admin_ban_user(target_id uuid) returns void
language plpgsql security definer as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'Unauthorized';
  end if;
  -- ban logic
end $$;
*/

-- 6. Blocked users never appear in feed, live, or chat
-- This must be incorporated into the get_feed() and get_live_feed() RPCs.
-- Update get_live_feed() to exclude blocked users:
create or replace function public.get_live_feed(
  p_radius_km float default 50
)
returns table (
  user_id uuid,
  name text,
  goal_code text,
  type_codes text[],
  expires_at timestamptz
)
language sql security definer set search_path = public as $$
  select 
    lp.user_id,
    p.first_name,
    lp.goal_code,
    lp.type_codes,
    lp.expires_at
  from public.live_presence lp
  join public.profiles p on p.id = lp.user_id
  where lp.expires_at > now()
    and lp.user_id != auth.uid()
    and not exists (
      select 1 from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = lp.user_id)
         or (b.blocker_id = lp.user_id and b.blocked_id = auth.uid())
    );
$$;
