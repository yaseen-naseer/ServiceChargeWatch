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
        set(name: string, value: string, options: {
          maxAge?: number
          path?: string
          domain?: string
          sameSite?: 'lax' | 'strict' | 'none'
          secure?: boolean
        }) {
          if (typeof document === 'undefined') return

          const cookieParts = [`${name}=${encodeURIComponent(value)}`]

          if (options.maxAge !== undefined) {
            cookieParts.push(`max-age=${options.maxAge}`)
          }

          if (options.path) {
            cookieParts.push(`path=${options.path}`)
          }

          if (options.domain) {
            cookieParts.push(`domain=${options.domain}`)
          }

          if (options.sameSite) {
            cookieParts.push(`SameSite=${options.sameSite}`)
          }

          if (options.secure !== false && window.location.protocol === 'https:') {
            cookieParts.push('Secure')
          }

          document.cookie = cookieParts.join('; ')
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          if (typeof document === 'undefined') return

          const cookieParts = [`${name}=`, 'max-age=0']

          if (options.path) {
            cookieParts.push(`path=${options.path}`)
          }

          if (options.domain) {
            cookieParts.push(`domain=${options.domain}`)
          }

          document.cookie = cookieParts.join('; ')
        },
      },
    }
  )
}
