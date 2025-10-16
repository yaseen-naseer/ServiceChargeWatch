# Performance Optimization Guide

**Phase**: 3
**Estimated Time**: 1 hour
**Status**: In Progress ⏳

---

## Overview

This guide covers performance optimization strategies for Service Charge Watch, including Lighthouse audits, caching strategies, and image optimization.

---

## 1. Lighthouse Audit Instructions

### Running Lighthouse Audits

#### Method 1: Chrome DevTools (Recommended)
1. **Open Chrome DevTools** (F12 or Ctrl+Shift+I)
2. **Navigate to Lighthouse tab**
3. **Configure audit**:
   - Categories: Performance, Accessibility, Best Practices, SEO, PWA
   - Device: Both Mobile and Desktop
   - Throttling: Simulated Slow 4G
4. **Run audit** on these pages:
   - Homepage (`/`)
   - Leaderboard (`/#leaderboard`)
   - Submit page (`/submit`)
   - Admin dashboard (`/admin/dashboard`)
   - Analytics page (`/admin/analytics`)
   - Hotel detail page (`/hotels/[id]`)

#### Method 2: CLI
```bash
npm install -g lighthouse

# Run on production URL
lighthouse https://your-app.vercel.app --view

# Run on local (with production build)
npm run build
npm start
lighthouse http://localhost:3000 --view

# Generate reports for all pages
lighthouse https://your-app.vercel.app --output=html --output-path=./lighthouse-reports/home.html
```

#### Method 3: Vercel Speed Insights
- Already integrated via `@vercel/speed-insights`
- Visit Vercel dashboard → Speed Insights
- Real user monitoring (RUM) data

### Target Scores (Post-Optimization)

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| Performance | 70-80 | 90+ | High |
| Accessibility | 85-95 | 95+ | High |
| Best Practices | 90-95 | 95+ | Medium |
| SEO | 90-95 | 95+ | Medium |
| PWA | 90-100 ✅ | 100 | Low |

---

## 2. Caching Strategy

### Current Caching

#### Static Assets (Next.js Default)
- JavaScript bundles: `Cache-Control: public, max-age=31536000, immutable`
- CSS files: `Cache-Control: public, max-age=31536000, immutable`
- Images in `public/`: `Cache-Control: public, max-age=31536000`

#### Dynamic Routes
- Currently: No caching (server-rendered each time)

### Recommended Caching Headers

```typescript
// next.config.ts - Add to headers() function
{
  source: '/api/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'no-store, must-revalidate',
    },
  ],
},
{
  source: '/hotels/:id',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  ],
},
{
  source: '/_next/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
},
```

### API Response Caching

#### For Supabase Queries
```typescript
// Add to frequently-accessed queries
const { data, error } = await supabase
  .from('sc_records')
  .select('*')
  .limit(10)

// Implement Next.js caching
export const revalidate = 3600 // Revalidate every hour

// Or use unstable_cache for granular control
import { unstable_cache } from 'next/cache'

const getCachedRecords = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('sc_records')
      .select('*')
      .limit(10)
    return data
  },
  ['sc-records'],
  { revalidate: 3600, tags: ['sc-records'] }
)
```

---

## 3. Image Optimization

### Current Image Usage

#### Next.js Image Component
- Already using `next/image` in some places
- Automatic optimization enabled
- WebP conversion enabled

### Optimization Checklist

#### 1. Convert all `<img>` to `<Image>`
```typescript
// Before
<img src="/icon-192.png" alt="Icon" />

// After
import Image from 'next/image'
<Image src="/icon-192.png" alt="Icon" width={192} height={192} />
```

#### 2. Add Image Dimensions
All images should have explicit `width` and `height` to prevent Cumulative Layout Shift (CLS).

#### 3. Use Priority for Above-Fold Images
```typescript
<Image
  src="/hero.png"
  alt="Hero"
  width={800}
  height={600}
  priority
/>
```

#### 4. Lazy Load Below-Fold Images
```typescript
<Image
  src="/content.png"
  alt="Content"
  width={400}
  height={300}
  loading="lazy"
/>
```

#### 5. Optimize Icon Files
```bash
# Re-generate icons with optimization
npm install -g @squoosh/cli

# Or use sharp with better compression
# Already have sharp installed
node scripts/generate-pwa-icons.js
```

---

## 4. Performance Optimizations

### Code Splitting

#### 1. Dynamic Imports for Heavy Components
```typescript
// Before
import { HeavyChart } from '@/components/heavy-chart'

// After
import dynamic from 'next/dynamic'
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // If not needed for SSR
})
```

#### 2. Use in Analytics Dashboard
```typescript
// In app/admin/analytics/page.tsx
const IndustryTrendsChart = dynamic(
  () => import('@/components/admin/analytics/industry-trends-chart')
    .then(mod => ({ default: mod.IndustryTrendsChart })),
  { loading: () => <div>Loading chart...</div> }
)
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Update next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(withSentryConfig(nextConfig, {...}))

# Run analysis
ANALYZE=true npm run build
```

### Tree Shaking Verification
- Ensure only used Radix UI components are imported
- Check lucide-react imports (use specific icons)
- Verify Recharts only imports needed charts

---

## 5. Database Query Optimization

### Current Performance

#### Existing Optimizations ✅
- Foreign key indexes
- RLS policies optimized
- Pagination implemented
- Filtered queries

#### Additional Optimizations

1. **Add Database Indexes**
```sql
-- Add to Supabase SQL editor
CREATE INDEX IF NOT EXISTS idx_submissions_status_created
ON submissions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sc_records_hotel_date
ON sc_records(hotel_id, year DESC, month DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_user_status
ON submissions(submitter_user_id, status);
```

2. **Use Supabase Edge Functions for Heavy Queries**
```typescript
// For analytics aggregations
// Instead of client-side aggregation, use database functions
CREATE OR REPLACE FUNCTION get_analytics_stats()
RETURNS TABLE (
  total_submissions BIGINT,
  total_approved BIGINT,
  total_rejected BIGINT,
  total_pending BIGINT,
  total_hotels BIGINT,
  total_users BIGINT,
  average_approval_time FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status IS NOT NULL),
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected'),
    COUNT(*) FILTER (WHERE status = 'pending'),
    COUNT(DISTINCT hotel_id),
    COUNT(DISTINCT submitter_user_id),
    AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at))/3600)
      FILTER (WHERE status = 'approved')
  FROM submissions;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Core Web Vitals Optimization

### Largest Contentful Paint (LCP)
**Target**: < 2.5s

Strategies:
- Preload critical fonts
- Optimize hero images
- Use priority for above-fold images
- Implement route prefetching

```typescript
// In layout.tsx
<link
  rel="preload"
  href="/fonts/geist-sans.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

### First Input Delay (FID) / Interaction to Next Paint (INP)
**Target**: < 100ms

Strategies:
- Reduce JavaScript execution time
- Use code splitting
- Defer non-critical scripts
- Optimize event handlers

### Cumulative Layout Shift (CLS)
**Target**: < 0.1

Strategies:
- Add explicit image dimensions
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use `font-display: swap` or `optional`

---

## 7. Network Optimization

### Font Loading
```css
/* In globals.css */
@font-face {
  font-family: 'Geist Sans';
  src: url('/fonts/geist-sans.woff2') format('woff2');
  font-display: swap; /* or optional */
  font-weight: 400;
}
```

### Preconnect to External Domains
```typescript
// In layout.tsx head
<link rel="preconnect" href="https://api.supabase.co" />
<link rel="preconnect" href="https://vercel.live" />
<link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
```

### Resource Hints
```typescript
// For critical routes
<link rel="prefetch" href="/leaderboard" />
<link rel="preload" href="/api/sc-records" as="fetch" />
```

---

## 8. Monitoring & Metrics

### Setup Real User Monitoring

Already integrated:
- ✅ Vercel Analytics
- ✅ Vercel Speed Insights
- ✅ Sentry Performance Monitoring

### Custom Performance Marks
```typescript
// In critical pages
'use client'
import { useEffect } from 'react'

export function PerformanceMonitor({ pageName }: { pageName: string }) {
  useEffect(() => {
    // Mark when component mounts
    performance.mark(`${pageName}-mount`)

    // Measure from navigation start
    performance.measure(
      `${pageName}-load-time`,
      'navigationStart',
      `${pageName}-mount`
    )

    // Log to analytics
    const measure = performance.getEntriesByName(`${pageName}-load-time`)[0]
    console.log(`${pageName} loaded in ${measure.duration}ms`)
  }, [pageName])

  return null
}
```

---

## 9. Build Optimization

### Next.js Config Optimizations

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ... existing config

  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'recharts',
    ],
  },

  // Compress
  compress: true,

  // Production source maps (optional)
  productionBrowserSourceMaps: false,
}
```

---

## 10. Testing Checklist

Before marking as complete:

### Performance
- [ ] Lighthouse score >= 90 on all major pages
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms
- [ ] CLS < 0.1
- [ ] Time to Interactive < 3.5s

### Caching
- [ ] Static assets cached for 1 year
- [ ] API responses have appropriate cache headers
- [ ] Hotel pages use stale-while-revalidate
- [ ] No unnecessary cache misses

### Images
- [ ] All images use next/image
- [ ] All images have width/height
- [ ] Priority images marked
- [ ] Icons optimized

### Bundle
- [ ] Bundle size analyzed
- [ ] No duplicate dependencies
- [ ] Heavy components lazy-loaded
- [ ] Tree-shaking verified

---

## Expected Results

### Before Optimization
```
Performance: 70-80
Bundle Size: ~800KB
LCP: 3-4s
CLS: 0.1-0.2
```

### After Optimization
```
Performance: 90-95
Bundle Size: ~600KB (-25%)
LCP: < 2.5s
CLS: < 0.1
TTI: < 3.5s
```

---

## Next Steps

1. Run initial Lighthouse audit (baseline)
2. Implement caching headers
3. Optimize images
4. Add dynamic imports for heavy components
5. Run final Lighthouse audit
6. Document results

---

**Status**: Ready to implement
**Priority**: High
**Impact**: Better user experience, improved SEO, faster load times
