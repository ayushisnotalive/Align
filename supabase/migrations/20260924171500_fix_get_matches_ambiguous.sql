CREATE OR REPLACE FUNCTION public.get_matches()
RETURNS TABLE (
    match_id uuid,
    other_user_id uuid,
    first_name text,
    s3_key text,
    last_message text,
    last_message_time timestamp with time zone,
    is_new boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH UserMatches AS (
        SELECT 
            m.id as match_id,
            CASE WHEN m.user_a = auth.uid() THEN m.user_b ELSE m.user_a END as other_user_id,
            m.last_message_at
        FROM matches m
        WHERE (m.user_a = auth.uid() OR m.user_b = auth.uid())
          AND m.status = 'active'
    ),
    LatestMessage AS (
        SELECT DISTINCT ON (messages.match_id)
            messages.match_id, messages.body, messages.created_at
        FROM messages
        WHERE messages.match_id IN (SELECT um.match_id FROM UserMatches um)
        ORDER BY messages.match_id, messages.created_at DESC
    )
    SELECT
        um.match_id,
        um.other_user_id,
        p.first_name,
        (SELECT md.s3_key FROM photos ph JOIN media md ON ph.media_id = md.id WHERE ph.user_id = um.other_user_id ORDER BY ph.position ASC LIMIT 1) as s3_key,
        lm.body as last_message,
        lm.created_at as last_message_time,
        (lm.body IS NULL) as is_new
    FROM UserMatches um
    JOIN profiles p ON p.id = um.other_user_id
    LEFT JOIN LatestMessage lm ON lm.match_id = um.match_id
    ORDER BY COALESCE(lm.created_at, um.last_message_at) DESC NULLS LAST;
END;
$$;
