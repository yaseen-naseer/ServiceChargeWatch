# Service Charge Watch

A transparency platform for tracking and comparing service charge payments across Maldives hotels and resorts.

## Project Overview

Service Charge Watch is a leaderboard-style platform that shows which hotels pay the best service charge, with verified monthly data and historical trends. Built to empower hospitality workers in the Maldives by providing transparency around service charge payments.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **State Management**: Zustand (if needed), React Server Components
- **Date Handling**: date-fns v4

## Project Status

✅ **Foundation Complete** - All infrastructure and database setup finished

### Completed Setup

1. **Development Environment**
   - Next.js 15 with TypeScript and App Router
   - Tailwind CSS and shadcn/ui configured
   - ESLint and Prettier configured

2. **Supabase Backend**
   - Project created in Singapore region (ap-southeast-1)
   - Database schema with 5 tables: hotels, sc_records, submissions, admin_users, exchange_rates
   - Row Level Security (RLS) policies implemented
   - Storage bucket configured for payslip uploads
   - TypeScript types auto-generated from schema

3. **Authentication & Security**
   - Supabase Auth configured with email verification
   - Middleware for route protection
   - Admin role system with super_admin tier
   - Client and server-side Supabase utilities

4. **Testing Data**
   - 8 sample hotels inserted
   - 3 months of historical SC records (Aug-Oct 2025)
   - Mix of resorts and city hotels

## Database Schema

### Tables

- **hotels**: Hotel information (name, atoll, type, staff_count, status)
- **sc_records**: Verified service charge records (monthly data)
- **submissions**: User submissions pending admin review
- **admin_users**: Admin access control (admin/super_admin roles)
- **exchange_rates**: USD to MVR conversion rates

### Security

- Public can read verified SC records and hotel info
- Authenticated users can submit new records
- Admins can verify/reject submissions
- Super admins can manage admin users
- Storage policies protect payslip uploads

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hxqndjsxhalajlkiemwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

## Project Structure

```
service-charge-watch/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages (homepage, hotel profiles)
│   ├── (auth)/            # Protected pages (submit, admin)
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── leaderboard/      # Leaderboard components
│   ├── charts/           # Chart components
│   ├── forms/            # Form components
│   └── admin/            # Admin dashboard components
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client & server utilities
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
├── types/                # TypeScript types
│   └── database.types.ts # Auto-generated from Supabase
└── supabase/            # Supabase migrations
    └── migrations/      # Database migration files
```

## Next Steps (Phase 1 Features)

The following features need to be built:

1. **Public Homepage** - Monthly leaderboard with top-paying hotels
2. **Hotel Profile Pages** - Individual hotel pages with current SC data
3. **Submission Form** - User form to submit SC records
4. **Admin Dashboard** - Verification queue for reviewing submissions
5. **Authentication Flows** - Login, signup, email verification pages

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Supabase Commands

```bash
# Generate TypeScript types after schema changes
npx supabase gen types typescript --project-id hxqndjsxhalajlkiemwf > types/database.types.ts
```

## Contributing

This project is in active development. Phase 1 MVP features are being built.

## License

TBD

---

**Project ID**: hxqndjsxhalajlkiemwf
**Region**: Singapore (ap-southeast-1)
**Dashboard**: https://supabase.com/dashboard/project/hxqndjsxhalajlkiemwf
