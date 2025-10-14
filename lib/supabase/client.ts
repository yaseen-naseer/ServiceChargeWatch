import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined
          const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
          return value ? decodeURIComponent(value) : undefined
        },
        set(name: string, value: string, options: { maxAge?: number; path?: string }) {
          if (typeof document === 'undefined') return
          const maxAge = options.maxAge ?? 60 * 60 * 24 * 365 // 1 year default
          const path = options.path ?? '/'
          document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=${path}; SameSite=Lax; Secure`
        },
        remove(name: string, options: { path?: string }) {
          if (typeof document === 'undefined') return
          const path = options.path ?? '/'
          document.cookie = `${name}=; max-age=0; path=${path}`
        },
      },
    }
  )
}
