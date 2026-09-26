#!/bin/bash

echo "🚀 Deploying Align to Production Supabase..."

if [ -z "$1" ]; then
  echo "Usage: ./deploy-prod.sh <PRODUCTION_PROJECT_REF>"
  echo "You can find your project ref in the Supabase Dashboard URL (https://supabase.com/dashboard/project/<PROJECT_REF>)"
  exit 1
fi

PROJECT_REF=$1

echo "Linking to remote project $PROJECT_REF..."
npx supabase link --project-ref $PROJECT_REF

echo "Pushing database schema and migrations to production..."
npx supabase db push

echo "Applying seed data (optional, but includes initial lookups/colleges)..."
# In a real production, you might selectively seed lookup tables only
# npx supabase db seed --db-url postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

echo "✅ Deployment complete!"
