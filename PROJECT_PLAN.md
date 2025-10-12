# Maldives Service Charge Transparency Platform - MVP Plan

## Core Concept
A leaderboard-style platform showing which hotels pay the best service charge, with verified monthly data and historical trends.

---

## Key Features for MVP

### 1. Public Homepage
- **Monthly Leaderboard**: Top paying hotels this month (sortable by total SC, per-employee average, USD amount)
- Quick stats: "Best paying hotel this month", "Average SC across all resorts"
- Search/filter: By hotel name, atoll, resort type

### 2. Hotel Profile Pages
- **Current Month SC**: Primary USD + Secondary MVR (if any)
- **12-month historical chart**: Line graph showing SC trends
- **Stats**: Average monthly SC, highest/lowest month, trend (↑↓)
- **Verification badge**: "Verified by 3 employees" or "Admin verified"
- **Last updated**: Date of latest verified data
- Hotel info: Location, staff count (estimate), resort type

### 3. Submission Flow (Users)
- Simple form:
  - Hotel name (dropdown from existing + "Add new")
  - Month/Year
  - **Primary SC (USD)** - required
  - **Secondary SC (MVR)** - optional
  - Your position (optional, for context)
  - Proof upload (payslip photo - blurred personal info)
- Status: "Pending" → "Under Review" → "Verified"
- Email notifications on status change

### 4. Admin Dashboard
- **Verification Queue**:
  - Pending submissions with uploaded proofs
  - Side-by-side: Previous month data vs new submission (spot anomalies)
  - Cross-reference: If multiple people submit for same hotel/month
  - Actions: Approve / Reject / Request clarification
- **Hotel Management**: Add/edit hotel details, merge duplicates
- **Analytics**: Submission patterns, flagged suspicious activity
- **Bulk actions**: Approve multiple submissions from same hotel if consistent

---

## Data Structure Ideas

### Hotel Entry
- Name
- Atoll
- Type (Resort/City Hotel/Guesthouse)
- Staff count estimate
- Status (Active/Closed)

### SC Record (Monthly)
- Hotel ID
- Month/Year
- Primary SC (USD) - required
- Secondary SC (MVR) - optional
- Total (converted to USD for fair comparison)
- Per-staff average (if staff count known)
- Verification status
- Number of confirmations
- Verified date

---

## Trust & Verification System

### Multi-level Verification
1. **Single Source (⚠️)**: One employee submitted, not yet verified
2. **Cross-verified (✓)**: 2+ employees confirmed same amount
3. **Admin Verified (✓✓)**: Admin reviewed proof and approved
4. **Official (⭐)**: Hotel management submitted directly

### Fraud Prevention
- Email verification required
- Rate limiting (same email can't spam submissions)
- Flag conflicting data (2 people submit different amounts for same month)
- IP tracking for patterns
- Auto-flag: If new submission is 50%+ different from previous month

---

## Leaderboard Categories

### Monthly Rankings
1. **Highest Total SC** (USD equivalent)
2. **Best Average per Staff** (if staff numbers known)
3. **Most Consistent** (lowest variance over 6 months)
4. **Rising Star** (biggest improvement from previous month)

### Filters
- By atoll
- By resort type (luxury/budget)
- By staff count range

---

## Historical Data Features
- **Hotel view**: 12-month trend chart for individual hotel
- **Comparison view**: Compare 2-3 hotels side by side
- **Industry trends**: Overall average SC trend across all hotels
- **Download reports**: CSV export for research/union use

---

## Key UX Decisions to Consider

### 1. Anonymous vs Named Submissions?
- Anonymous = More submissions, less fear
- Named (private) = Better verification, can contact for clarification
- **Suggestion**: Email required but not displayed publicly

### 2. Show exact amounts vs ranges?
- Exact = More useful, transparent
- Ranges = Less pressure on individual hotels
- **Suggestion**: Show exact for verified data, protect pending submissions

### 3. How to handle missing months?
- Show gap in chart
- Mark as "No data reported"
- Don't penalize in rankings (only rank hotels with current month data)

### 4. Per-staff average or total?
- Total favors large resorts
- Per-staff is fairer but requires staff count data
- **Suggestion**: Show both, let users toggle

### 5. Currency conversion for leaderboard?
- Convert everything to USD for fair comparison
- Use official MMA exchange rate
- Display original currency + converted amount

---

## MVP Scope (What to Build First)

### Phase 1 (Core MVP)
- Public leaderboard (current month only)
- Hotel profiles with current SC
- Basic submission form
- Simple admin approval queue
- Top 10 hotels display

### Phase 2
- Historical data (12 months)
- Charts and trends
- Multiple verification levels
- Email notifications

### Phase 3
- Advanced filters
- Comparison tools
- Mobile app
- API for third parties

---

## Technical Considerations
- **Mobile-first**: Most hotel staff use phones
- **Image compression**: Payslips can be large files
- **Privacy**: Auto-blur personal info in uploaded images (AI)
- **Caching**: Leaderboard doesn't need real-time updates
- **Exchange rates**: Store USD/MVR rate at submission time

---

## Potential Challenges
- **Initial data**: Need seed data to attract users
- **Hotel resistance**: Some hotels might pressure staff not to share
- **Data gaps**: Not all months will have submissions
- **Verification bottleneck**: Admin time for reviewing proofs
- **Multiple positions**: Department heads might get more SC than servers

---

## Next Steps
1. Finalize data model and relationships
2. Choose tech stack
3. Design wireframes for key pages
4. Set up development environment
5. Build Phase 1 features
