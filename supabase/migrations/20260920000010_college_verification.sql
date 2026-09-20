-- 1) Allow college-ID proof files, verification rows, and their consent
alter table public.media drop constraint if exists media_kind_check;
alter table public.media add constraint media_kind_check
  check (kind in ('profile_photo','chat_image','face_check','college_id'));

alter table public.verifications drop constraint if exists verifications_type_check;
alter table public.verifications add constraint verifications_type_check
  check (type in ('email','face','college_id'));

alter table public.consents drop constraint if exists consents_type_check;
alter table public.consents add constraint consents_type_check
  check (type in ('terms','privacy','location','sensitive_data','face_biometric','college_id_proof'));

-- 2) Link a verification to the college claim it proves
alter table public.verifications
  add column if not exists user_college_id uuid references public.user_colleges(id) on delete cascade,
  add column if not exists proof_email text check (proof_email is null or proof_email = lower(proof_email)),
  add column if not exists reject_reason text check (char_length(reject_reason) <= 300);
create index if not exists verifications_pending_idx
  on public.verifications (status, created_at) where type = 'college_id';

-- 3) The verified flag (true only when an admin approves)
alter table public.user_colleges
  add column if not exists verified boolean not null default false,
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','approved','rejected')),
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references public.admins(id);

alter table public.user_colleges add constraint user_colleges_verified_consistent
  check (verified = (verification_status = 'approved'));

create index if not exists user_colleges_verified_idx
  on public.user_colleges (college_id) where is_current and verified;

-- 4) The client may NOT touch the verification columns.
--    To change college: delete the row and add a new one (it starts unverified).
revoke insert, update on public.user_colleges from authenticated;
grant insert (user_id, college_id, course, study_year, grad_year, show_on_profile)
  on public.user_colleges to authenticated;
grant update (course, study_year, grad_year, show_on_profile)
  on public.user_colleges to authenticated;

-- Matched users can see a college only if verified and the owner chose to show it
create policy uc_matched on public.user_colleges for select to authenticated
  using (verified and show_on_profile and public.are_matched(auth.uid(), user_id));

-- 5) User submits proof (the only way to enter 'pending')
create or replace function public.submit_college_verification(
  p_user_college_id uuid, p_media_id uuid, p_proof_email text default null)
returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  uc public.user_colleges;
  new_id uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select * into uc from public.user_colleges
   where id = p_user_college_id and user_id = uid for update;
  if not found then raise exception 'college not found'; end if;
  if uc.verification_status in ('pending','approved') then
    raise exception 'verification is already %', uc.verification_status;
  end if;

  -- proof must be the caller's own college_id upload
  if not exists (select 1 from public.media m
      where m.id = p_media_id and m.owner_id = uid
        and m.kind = 'college_id' and m.deleted_at is null) then
    raise exception 'invalid proof file';
  end if;

  -- latest consent must be granted
  if coalesce((select c.granted from public.consents c
      where c.user_id = uid and c.type = 'college_id_proof'
      order by c.created_at desc limit 1), false) is not true then
    raise exception 'consent required';
  end if;

  -- max 3 rejected attempts per 30 days
  if (select count(*) from public.verifications v
       where v.user_id = uid and v.type = 'college_id' and v.status = 'rejected'
         and v.created_at > now() - interval '30 days') >= 3 then
    raise exception 'too many attempts, try again later';
  end if;

  if p_proof_email is not null and p_proof_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email';
  end if;

  insert into public.verifications
    (user_id, type, status, provider, media_id, user_college_id, proof_email)
  values
    (uid, 'college_id', 'pending', 'manual', p_media_id, uc.id, lower(p_proof_email))
  returning id into new_id;

  update public.user_colleges set verification_status = 'pending' where id = uc.id;
  return new_id;
end $$;

-- 6) Admin review queue
create or replace function public.admin_pending_college_verifications(p_limit int default 50)
returns table (verification_id uuid, user_id uuid, first_name text, college_name text,
               city_name text, proof_email text, media_id uuid, s3_key text,
               submitted_at timestamptz)
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  return query
    select v.id, v.user_id, p.first_name, c.name, ci.name, v.proof_email,
           v.media_id, m.s3_key, v.created_at
    from public.verifications v
    join public.user_colleges uc on uc.id = v.user_college_id
    join public.colleges c on c.id = uc.college_id
    join public.cities ci on ci.id = c.city_id
    join public.profiles p on p.id = v.user_id
    left join public.media m on m.id = v.media_id
    where v.type = 'college_id' and v.status = 'pending'
    order by v.created_at
    limit least(greatest(p_limit, 1), 200);
end $$;

-- 7) Admin decision: approve or reject
create or replace function public.admin_review_college_verification(
  p_verification_id uuid, p_approve boolean, p_reason text default null)
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare v public.verifications;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;

  select * into v from public.verifications
   where id = p_verification_id and type = 'college_id' and status = 'pending' for update;
  if not found then raise exception 'not a pending college verification'; end if;

  if not p_approve and (p_reason is null or char_length(trim(p_reason)) < 3) then
    raise exception 'a reason is required to reject';
  end if;

  update public.verifications set
    status = case when p_approve then 'approved' else 'rejected' end,
    reviewed_by = auth.uid(), completed_at = now(),
    reject_reason = case when p_approve then null else left(trim(p_reason), 300) end,
    proof_email = null                       -- data minimisation
  where id = v.id;

  update public.user_colleges set
    verified = p_approve,
    verification_status = case when p_approve then 'approved' else 'rejected' end,
    verified_at = case when p_approve then now() else null end,
    verified_by = case when p_approve then auth.uid() else null end
  where id = v.user_college_id;

  -- schedule the ID image for deletion (a job in Phase 8 does the actual purge)
  if v.media_id is not null then
    update public.media set purge_after = now() + interval '3 days' where id = v.media_id;
  end if;

  insert into public.audit_log (admin_id, action, target_id, details)
  values (auth.uid(), 'college_verification_review', v.user_id,
          jsonb_build_object('verification_id', v.id, 'approved', p_approve));

  insert into public.notifications (user_id, type, data)
  values (v.user_id, 'verification',
          jsonb_build_object('kind', 'college', 'approved', p_approve));
end $$;

-- 8) Only signed-in users may call these (admin functions re-check is_admin() inside)
revoke all on function public.submit_college_verification(uuid, uuid, text) from public, anon;
revoke all on function public.admin_pending_college_verifications(int) from public, anon;
revoke all on function public.admin_review_college_verification(uuid, boolean, text) from public, anon;
grant execute on function public.submit_college_verification(uuid, uuid, text) to authenticated;
grant execute on function public.admin_pending_college_verifications(int) to authenticated;
grant execute on function public.admin_review_college_verification(uuid, boolean, text) to authenticated;