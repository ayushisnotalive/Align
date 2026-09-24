create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  insert into public.profiles (id) values (new.id);
  -- Insert email from new.email and phone from raw_user_meta_data
  insert into public.profile_private (user_id, email, phone) 
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'phone'
  );
  insert into public.discovery_settings (user_id) values (new.id);
  insert into public.user_location (user_id) values (new.id);
  return new;
end $$;
