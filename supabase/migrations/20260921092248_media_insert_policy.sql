-- Grant INSERT permissions on public.media to authenticated users so they can log uploaded files
grant insert on public.media to authenticated;

-- Allow users to insert media rows only if they are the owner
create policy media_insert on public.media for insert to authenticated with check (owner_id = auth.uid());
