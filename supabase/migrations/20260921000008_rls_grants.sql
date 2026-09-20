-- 1) Enable RLS on EVERY table in public
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- 2) Deny by default at the privilege layer too
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon;
alter default privileges in schema public revoke all on tables from anon, authenticated;

-- 3) Read grants (RLS still filters rows)
grant select on
  public.lookup_values, public.attribute_definitions, public.states, public.cities,
  public.colleges, public.interests, public.feature_flags, public.plans,
  public.profiles, public.profile_private, public.media, public.photos,
  public.user_attributes, public.user_interests, public.user_colleges,
  public.college_requests, public.verifications, public.user_places,
  public.user_location, public.discovery_settings, public.swipes, public.matches,
  public.messages, public.message_requests, public.blind_dates, public.blocks,
  public.reports, public.bans, public.audit_log, public.user_devices,
  public.consents, public.deletion_requests, public.daily_usage,
  public.subscriptions, public.notifications
to authenticated;

-- 4) Write grants (column-level where the client must not touch everything)
grant update (first_name, gender_id, pronoun_id, orientation_id, orientation_visible,
  interested_in, occupation, employer, school, education_id, bio, height_cm,
  hometown_city_id, show_zodiac, onboarding_step) on public.profiles to authenticated;
grant update (last_name, dob, email) on public.profile_private to authenticated;
grant insert, delete on public.photos to authenticated;
grant update (position) on public.photos to authenticated;
grant insert, update, delete on public.user_attributes, public.user_interests,
  public.user_places, public.user_colleges to authenticated;
grant insert on public.college_requests to authenticated;
grant update (mode, active_place_id, radius_km, min_age, max_age, show_genders,
  college_scope, attr_filters, verified_only, show_me, show_distance)
  on public.discovery_settings to authenticated;
grant insert (match_id, sender_id, body, media_id) on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;
grant insert, delete on public.blocks to authenticated;
grant insert (reporter_id, target_id, context, context_ref_id, reason) on public.reports to authenticated;
grant insert, update, delete on public.user_devices to authenticated;
grant insert on public.consents, public.deletion_requests, public.analytics_events,
  public.profile_views, public.app_sessions to authenticated;
grant update on public.app_sessions to authenticated;
grant update (read_at) on public.notifications to authenticated;

grant execute on function public.is_admin(), public.are_matched(uuid, uuid),
  public.can_chat(uuid) to authenticated;

-- 5) Policies

-- Reference data
create policy ref_select on public.lookup_values for select to authenticated using (is_active);
create policy ref_select on public.attribute_definitions for select to authenticated using (is_active);
create policy ref_select on public.states for select to authenticated using (true);
create policy ref_select on public.cities for select to authenticated using (is_active);
create policy ref_select on public.colleges for select to authenticated using (is_approved);
create policy ref_select on public.interests for select to authenticated using (true);
create policy ref_select on public.feature_flags for select to authenticated using (true);
create policy ref_select on public.plans for select to authenticated using (is_active);

-- profiles: own row, matched partner's row, or admin. Everyone else goes through RPCs.
create policy profiles_self on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_matched on public.profiles for select to authenticated using (public.are_matched(auth.uid(), id));
create policy profiles_admin on public.profiles for select to authenticated using (public.is_admin());
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- profile_private: owner or admin only
create policy pp_self on public.profile_private for select to authenticated using (user_id = auth.uid());
create policy pp_admin on public.profile_private for select to authenticated using (public.is_admin());
create policy pp_update_self on public.profile_private for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- media: owner, matched partner (approved profile photos only), admin. No client writes.
create policy media_self on public.media for select to authenticated using (owner_id = auth.uid());
create policy media_matched on public.media for select to authenticated using (
  kind = 'profile_photo' and moderation_status = 'ok' and deleted_at is null
  and public.are_matched(auth.uid(), owner_id));
create policy media_admin on public.media for select to authenticated using (public.is_admin());

-- photos
create policy photos_self_select on public.photos for select to authenticated using (user_id = auth.uid());
create policy photos_matched on public.photos for select to authenticated using (public.are_matched(auth.uid(), user_id));
create policy photos_insert on public.photos for insert to authenticated with check (
  user_id = auth.uid()
  and exists (select 1 from public.media m where m.id = media_id and m.owner_id = auth.uid() and m.kind = 'profile_photo'));
create policy photos_update on public.photos for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy photos_delete on public.photos for delete to authenticated using (user_id = auth.uid());

-- optional attributes and interests
create policy ua_self on public.user_attributes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ua_matched on public.user_attributes for select to authenticated using (
  visibility in ('public','matches_only') and public.are_matched(auth.uid(), user_id));
create policy ui_self on public.user_interests for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ui_matched on public.user_interests for select to authenticated using (public.are_matched(auth.uid(), user_id));

-- college, places
create policy uc_self on public.user_colleges for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy up_self on public.user_places for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy cr_select on public.college_requests for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy cr_insert on public.college_requests for insert to authenticated with check (user_id = auth.uid());

-- verification (read-only for the user; written by Edge Functions with service role)
create policy ver_select on public.verifications for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- location + discovery
create policy loc_self on public.user_location for select to authenticated using (user_id = auth.uid());
create policy ds_select on public.discovery_settings for select to authenticated using (user_id = auth.uid());
create policy ds_update on public.discovery_settings for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- matching: read-only for clients (writes only via RPC)
create policy swipes_self on public.swipes for select to authenticated using (swiper_id = auth.uid());
create policy matches_self on public.matches for select to authenticated using (auth.uid() in (user_a, user_b));
create policy mr_self on public.message_requests for select to authenticated using (auth.uid() in (sender_id, receiver_id));
create policy bd_self on public.blind_dates for select to authenticated using (auth.uid() in (user_a, user_b));

-- messages
create policy msg_select on public.messages for select to authenticated using (public.can_chat(match_id));
create policy msg_insert on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.can_chat(match_id));
create policy msg_mark_read on public.messages for update to authenticated
  using (public.can_chat(match_id) and sender_id <> auth.uid())
  with check (public.can_chat(match_id) and sender_id <> auth.uid());

-- safety
create policy blocks_self on public.blocks for select to authenticated using (blocker_id = auth.uid());
create policy blocks_insert on public.blocks for insert to authenticated with check (blocker_id = auth.uid());
create policy blocks_delete on public.blocks for delete to authenticated using (blocker_id = auth.uid());
create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy reports_admin on public.reports for select to authenticated using (public.is_admin());
create policy bans_admin on public.bans for select to authenticated using (public.is_admin());
create policy audit_admin on public.audit_log for select to authenticated using (public.is_admin());

-- devices and telemetry
create policy dev_self on public.user_devices for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy sess_insert on public.app_sessions for insert to authenticated with check (user_id = auth.uid());
create policy sess_update on public.app_sessions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy pv_insert on public.profile_views for insert to authenticated with check (viewer_id = auth.uid());
create policy ae_insert on public.analytics_events for insert to authenticated with check (user_id = auth.uid());

-- consent, deletion, money, notifications
create policy consents_select on public.consents for select to authenticated using (user_id = auth.uid());
create policy consents_insert on public.consents for insert to authenticated with check (user_id = auth.uid());
create policy del_select on public.deletion_requests for select to authenticated using (user_id = auth.uid());
create policy del_insert on public.deletion_requests for insert to authenticated with check (user_id = auth.uid());
create policy usage_self on public.daily_usage for select to authenticated using (user_id = auth.uid());
create policy subs_self on public.subscriptions for select to authenticated using (user_id = auth.uid());
create policy notif_select on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notif_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- No policies exist for: otp_challenges, location_history, auth_events, live_presence,
-- live_sessions_log, admins. With RLS on, that means clients cannot touch them at all.