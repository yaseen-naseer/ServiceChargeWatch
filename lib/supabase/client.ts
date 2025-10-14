import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie
            .split('; ')
            .filter(Boolean)
            .map(cookie => {
              const [name, ...values] = cookie.split('=')
              return { name, value: values.join('=') }
            })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
            const cookieOptions = [
              `${name}=${value}`,
              'path=/',
              options?.maxAge ? `max-age=${options.maxAge}` : '',
              options?.sameSite ? `samesite=${options.sameSite}` : 'samesite=lax',
              isSecure || options?.secure ? 'secure' : '',
            ].filter(Boolean).join('; ')

            document.cookie = cookieOptions
          })
        },
      },
    }
  )
}
