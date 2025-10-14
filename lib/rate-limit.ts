import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests allowed in the time window
}

interface RequestLog {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// In production, consider using Redis or Upstash for distributed rate limiting
const rateLimitStore = new Map<string, RequestLog>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, log] of rateLimitStore.entries()) {
    if (log.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return 'unknown'
}

/**
 * Rate limit middleware for API routes
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @param identifier - Optional custom identifier (defaults to IP address)
 * @returns null if allowed, NextResponse with 429 if rate limited
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): Promise<NextResponse | null> {
  const key = identifier || getClientIP(request)
  const now = Date.now()

  const log = rateLimitStore.get(key)

  if (!log || log.resetTime < now) {
    // No log or expired log - create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.interval,
    })
    return null
  }

  if (log.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((log.resetTime - now) / 1000)

    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(log.resetTime).toISOString(),
        },
      }
    )
  }

  // Increment counter
  log.count += 1
  rateLimitStore.set(key, log)

  return null
}

/**
 * Common rate limit configurations
 */
export const RATE_LIMITS = {
  // Strict limits for authentication endpoints
  AUTH: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },

  // Moderate limits for submission endpoints
  SUBMISSION: {
    interval: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 submissions per hour
  },

  // Lenient limits for admin endpoints
  ADMIN: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },

  // General API limits
  API: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
} as const

/**
 * Helper to add rate limit headers to successful responses
 */
export function addRateLimitHeaders(
  response: NextResponse,
  config: RateLimitConfig,
  identifier: string
): NextResponse {
  const log = rateLimitStore.get(identifier)

  if (log) {
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set(
      'X-RateLimit-Remaining',
      Math.max(0, config.maxRequests - log.count).toString()
    )
    response.headers.set('X-RateLimit-Reset', new Date(log.resetTime).toISOString())
  }

  return response
}
