-- Grant delete on media table to authenticated users
grant delete on public.media to authenticated;

-- Allow users to delete their own media rows
create policy media_delete on public.media for delete to authenticated
  using (owner_id = auth.uid());
