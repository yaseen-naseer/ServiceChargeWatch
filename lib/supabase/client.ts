import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  // Default configuration - uses cookies automatically
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
