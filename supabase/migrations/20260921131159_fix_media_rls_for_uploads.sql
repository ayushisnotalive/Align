-- Grant insert and delete on media table to authenticated users
grant insert, delete on public.media to authenticated;

-- Allow users to insert media rows if they own them
create policy media_insert on public.media for insert to authenticated
  with check (owner_id = auth.uid());

-- Allow users to delete their own media rows
create policy media_delete on public.media for delete to authenticated
  using (owner_id = auth.uid());
