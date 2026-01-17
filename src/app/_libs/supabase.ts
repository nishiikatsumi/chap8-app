'use client'

import { createClient } from '@supabase/supabase-js'

// クライアントサイド用のSupabaseクライアント
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

