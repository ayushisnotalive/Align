// @ts-nocheck
import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3.370.0'
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3.370.0'
import { createClient } from 'npm:@supabase/supabase-js@2.31.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { kind, contentType, size } = await req.json()

    if (!['profile_photo', 'chat_image', 'college_id'].includes(kind)) {
      return new Response(JSON.stringify({ error: 'Invalid kind' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Add size constraint check (e.g. 5MB)
    if (size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File too large. Max 5MB.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Optional: check max photos if kind === 'profile_photo'
    if (kind === 'profile_photo') {
      const { count } = await supabaseClient
        .from('media')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('kind', 'profile_photo')

      if (count !== null && count >= 6) {
        return new Response(JSON.stringify({ error: 'Maximum 6 profile photos allowed.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const s3Client = new S3Client({
      region: Deno.env.get('AWS_REGION')!,
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!,
      },
    })

    const bucketName = Deno.env.get('AWS_BUCKET_NAME')!
    const uuid = crypto.randomUUID()
    const extension = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg'
    
    const prefix = kind === 'college_id' ? 'college-id' : 'media'
    const s3Key = `${prefix}/${user.id}/${uuid}.${extension}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    return new Response(
      JSON.stringify({
        url: presignedUrl,
        key: s3Key,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
