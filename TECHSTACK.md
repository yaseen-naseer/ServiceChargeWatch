# Service Charge Watch - Tech Stack

## Overview
Modern, production-ready tech stack using Next.js, shadcn/ui, and Supabase.

---

## Frontend

### Core Framework
- **Next.js 15** (App Router)
  - Latest stable version
  - Server Components for better performance
  - Built-in SEO optimization
  - API routes for backend logic

### UI & Styling
- **shadcn/ui** - Component library
  - Built on Radix UI primitives
  - Fully customizable
  - Accessible by default
  - Copy-paste components (no package bloat)
- **Tailwind CSS** - Utility-first CSS
  - Comes integrated with shadcn/ui
  - Responsive design made easy
  - Dark mode support

### Data Visualization
- **Recharts** or **Tremor**
  - Modern charting library for historical SC data
  - Line charts for trends
  - Bar charts for leaderboards
  - React-native support

### Forms & Validation
- **React Hook Form** - Form state management
  - Minimal re-renders
  - Easy validation
  - TypeScript support
- **Zod** - Schema validation
  - Type-safe validation
  - Works seamlessly with React Hook Form
  - Reusable schemas

### State Management
- **React Server Components** (primary)
- **Zustand** (if client-side state needed)
  - Lightweight alternative to Redux
  - Simple API
  - No boilerplate

---

## Backend & Database

### Backend as a Service
- **Supabase**
  - PostgreSQL database
  - RESTful API auto-generated
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Edge Functions
  - Built-in Authentication
  - File Storage

### Database
- **PostgreSQL** (via Supabase)
  - Relational data perfect for hotels/records
  - JSONB for flexible data
  - Full-text search capabilities
  - Robust querying

### File Storage
- **Supabase Storage**
  - Payslip image uploads
  - Automatic image optimization
  - Access control via RLS
  - CDN delivery

### Authentication
- **Supabase Auth**
  - Email verification
  - Role-based access (admin/user)
  - JWT tokens
  - Password reset flows

---

## Package Manager
- **npm** - Node package manager
  - Wide compatibility
  - Reliable dependency management

---

## Additional Libraries

### Date & Time
- **date-fns** (v4.x)
  - Modern alternative to moment.js
  - Tree-shakeable
  - Lightweight
  - Immutable

### Image Handling
- **next/image** (built-in)
  - Automatic optimization
  - Lazy loading
  - Responsive images
- **Supabase Storage** for uploads

### Email Notifications
- **Supabase Auth Emails** (built-in)
- **Resend** (optional, for custom emails)
  - Modern email API
  - React email templates
  - Good deliverability

### Currency & Formatting
- **Custom implementation** or **exchange-rates-api**
  - USD/MVR conversion
  - Store exchange rate at submission time
  - Intl.NumberFormat for display

---

## Development Tools

### Type Safety
- **TypeScript** (v5.x)
  - Full type coverage
  - Better IDE support
  - Catch errors early
- **Supabase CLI** - Generate database types automatically

### Code Quality
- **ESLint** - Linting
  - Next.js recommended config
  - Catches common errors
- **Prettier** - Code formatting
  - Consistent code style
  - Auto-format on save

### Version Control
- **Git** - Source control
- **GitHub/GitLab** - Repository hosting

---

## Deployment & Hosting

### Recommended Platform
- **Vercel** (optimal for Next.js)
  - Zero-config deployment
  - Automatic previews
  - Edge network
  - Free tier available
- **Netlify** (alternative)
  - Good Next.js support
  - Generous free tier

### Database & Backend
- **Supabase Cloud**
  - Hosted PostgreSQL
  - Free tier: 500MB database, 1GB file storage
  - Automatic backups
  - Global CDN

---

## Key Package Versions

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "tailwindcss": "^3.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "recharts": "^2.x",
    "date-fns": "^4.x",
    "zustand": "^5.x",
    "typescript": "^5.x"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "eslint": "^8.x",
    "eslint-config-next": "^15.x",
    "prettier": "^3.x"
  }
}
```

---

## Why This Stack?

### Advantages
✅ **Modern & Maintained** - All packages actively developed, no deprecation risk
✅ **Type-safe** - Full TypeScript support across frontend and backend
✅ **Fast Development** - shadcn/ui + Supabase = rapid prototyping
✅ **Scalable** - Can handle growth from MVP to production
✅ **SEO-friendly** - Next.js App Router with server components
✅ **Cost-effective** - Generous free tiers for MVP stage
✅ **Real-time** - Supabase supports live updates for admin dashboard
✅ **Mobile-ready** - Responsive design out of the box
✅ **Secure** - Row Level Security at database level
✅ **Developer Experience** - Great tooling and documentation

### Supabase Features We'll Use
1. **Row Level Security (RLS)** - Data protection at database level
2. **Storage with RLS** - Secure payslip uploads
3. **Auth** - Email verification, admin roles
4. **Edge Functions** - Complex verification logic
5. **Real-time Subscriptions** - Admin sees new submissions instantly
6. **Auto-generated APIs** - REST endpoints from database schema
7. **Database Functions** - Complex queries and aggregations

---

## Project Structure

```
service-charge-watch/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages (no auth)
│   │   ├── page.tsx              # Homepage with leaderboard
│   │   ├── hotels/
│   │   │   └── [id]/page.tsx     # Hotel profile page
│   │   └── about/page.tsx        # About/FAQ page
│   ├── (auth)/                   # Protected pages
│   │   ├── submit/page.tsx       # SC submission form
│   │   └── admin/
│   │       ├── dashboard/page.tsx # Admin dashboard
│   │       └── verify/page.tsx   # Verification queue
│   ├── api/                      # API routes
│   │   ├── webhooks/             # Supabase webhooks
│   │   └── cron/                 # Scheduled jobs
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── leaderboard/
│   │   ├── leaderboard-table.tsx
│   │   ├── leaderboard-filters.tsx
│   │   └── hotel-card.tsx
│   ├── charts/
│   │   ├── sc-trend-chart.tsx
│   │   └── comparison-chart.tsx
│   ├── forms/
│   │   └── submission-form.tsx
│   └── admin/
│       ├── verification-queue.tsx
│       └── submission-review.tsx
├── lib/                          # Utility functions
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase
│   │   ├── server.ts             # Server-side Supabase
│   │   └── middleware.ts         # Auth middleware
│   ├── utils.ts                  # Helper functions
│   ├── validations.ts            # Zod schemas
│   └── constants.ts              # App constants
├── types/                        # TypeScript types
│   ├── database.types.ts         # Generated from Supabase
│   └── index.ts                  # Custom types
├── supabase/                     # Supabase config
│   ├── migrations/               # Database migrations
│   ├── seed.sql                  # Seed data
│   └── config.toml               # Supabase config
├── public/                       # Static assets
│   ├── images/
│   └── icons/
├── .env.local                    # Environment variables
├── .env.example                  # Example env file
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json
└── README.md
```

---

## Database Schema (Supabase Tables)

### `hotels`
```sql
- id (uuid, primary key)
- name (text, unique)
- atoll (text)
- type (enum: resort, city_hotel, guesthouse)
- staff_count (integer, nullable)
- status (enum: active, closed)
- created_at (timestamp)
- updated_at (timestamp)
```

### `sc_records`
```sql
- id (uuid, primary key)
- hotel_id (uuid, foreign key -> hotels.id)
- month (integer, 1-12)
- year (integer)
- usd_amount (decimal, required)
- mvr_amount (decimal, nullable)
- total_usd (decimal, computed)
- verification_status (enum: pending, verified, rejected)
- verification_count (integer, default 1)
- verified_at (timestamp)
- verified_by (uuid, foreign key -> auth.users)
- created_at (timestamp)
- unique constraint on (hotel_id, month, year)
```

### `submissions`
```sql
- id (uuid, primary key)
- hotel_id (uuid, foreign key -> hotels.id)
- month (integer)
- year (integer)
- usd_amount (decimal)
- mvr_amount (decimal, nullable)
- submitter_email (text)
- position (text, nullable)
- proof_url (text, nullable)
- status (enum: pending, under_review, approved, rejected)
- rejection_reason (text, nullable)
- reviewed_by (uuid, foreign key -> auth.users)
- reviewed_at (timestamp)
- created_at (timestamp)
```

### `admin_users`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> auth.users)
- role (enum: admin, super_admin)
- created_at (timestamp)
```

### `exchange_rates`
```sql
- id (uuid, primary key)
- date (date, unique)
- usd_to_mvr (decimal)
- source (text)
- created_at (timestamp)
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (optional)
RESEND_API_KEY=your-resend-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-ga-id
```

---

## Development Workflow

1. **Local Development**
   ```bash
   npm install
   npm run dev
   ```

2. **Supabase Local Development**
   ```bash
   npx supabase init
   npx supabase start
   npx supabase db reset
   ```

3. **Type Generation**
   ```bash
   npx supabase gen types typescript --local > types/database.types.ts
   ```

4. **Database Migrations**
   ```bash
   npx supabase migration new migration_name
   npx supabase db push
   ```

---

## Security Considerations

### Row Level Security (RLS) Policies
- Public can read verified SC records
- Only authenticated users can submit
- Only admins can verify/reject submissions
- Only admins can edit hotel data
- Submitters can only see their own submissions

### Data Protection
- Payslip images require authentication to view
- Personal info in images should be blurred (client-side before upload)
- Email addresses never displayed publicly
- Rate limiting on submission endpoints

### Authentication
- Email verification required for submission
- Admin accounts manually approved
- JWT tokens with short expiration
- Secure session management via Supabase

---

## Next Steps

1. ✅ Finalize tech stack (DONE)
2. Initialize Next.js project with TypeScript
3. Set up Supabase project and local development
4. Install and configure shadcn/ui
5. Create database schema and migrations
6. Implement authentication flows
7. Build core features (Phase 1)
