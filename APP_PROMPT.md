Build a modern Next.js (App Router) Invoice Parser frontend that looks like a clean SaaS admin dashboard (similar to the attached screenshot: left sidebar + top bar + white cards + soft shadows).

TECH STACK
- Next.js App Router + TypeScript
- Tailwind CSS
- UI library: shadcn/ui (Radix) + lucide-react icons
- Data fetching: TanStack React Query (optional but preferred)
- Use client components where needed

API (base URL: http://localhost:8080)
- POST /extract  (multipart/form-data: file)
- GET /invoice/{invoice_id}
- GET /invoices/vendor/{vendor_name}

ROUTING / PAGES (multi-page)
1) /login
- Centered card login UI
- Dummy auth: username=admin, password=admin
- Store auth in localStorage/sessionStorage (e.g., "auth=true")
- Redirect to /dashboard on success
- Show inline validation errors and a toast

2) /dashboard (protected)
- Top header bar: “Welcome, admin” + Logout button (clears auth and redirects to /login)
- Main title: Dashboard + subtitle
- Stats row (4 cards with small icon badge on the right):
  - Total invoices
  - This month
  - Pending review
  - Average value
- Quick Actions card with 2x2 buttons:
  - Upload Invoice -> /upload
  - View All -> /invoices
  - Favorites (dummy)
  - Settings (dummy)
- Top Vendor card (vendor name + badge like “5 invoices”)
- Recent Invoices section (table preview + “View All →”)

3) /upload (protected)
- Drag & drop upload zone (dashed border), also click to select file
- Validate formats: PDF, PNG, JPG, JPEG
- Upload to POST /extract with loading spinner/progress state
- On success: toast + navigate to /invoice/[id] (use returned invoice_id; if API returns different field, infer it safely)
- On error: toast with friendly message

4) /invoices (protected)
- Big card containing a table/grid of invoices (mock list if API lacks “get all”)
- Filtering controls (top row):
  - vendor search input
  - status dropdown (All / Extracted / Pending Review) – can be derived from confidence if available
  - date range dropdown (Last 7 days / 30 days / All) – can be local filter
- Sorting by date/amount/vendor (client-side ok)
- Pagination (client-side ok)
- Row click navigates to /invoice/[id]

5) /invoice/[id] (protected)
- Two-column layout:
  - Left: extracted fields (editable form with validation)
  - Right: invoice preview/download card (if file URL exists; otherwise show placeholder)
- Back button (“← Back to invoices”)
- Sections: Vendor, Dates, Totals, Line items (render if exists)
- “Save Changes” can be local-only (no backend needed)

AUTH / ROUTE PROTECTION
- Implement a simple guard: if auth not set, redirect to /login for protected pages.
- Use a reusable layout for protected routes: sidebar + topbar + content.

GLOBAL UI / STYLING (must match modern dashboard look)
- Layout:
  - Left sidebar fixed (~260px) with section headers: CORE, ANALYTICS, MANAGEMENT
  - Sidebar items with icons and active state highlight (soft blue background)
  - Top bar sticky, minimal, with user greeting + logout
- Visual style:
  - App background: light gray (bg-slate-50)
  - Cards: white, rounded-2xl, border border-slate-200, shadow-sm
  - Typography: big page titles (text-3xl font-semibold), muted subtitles (text-slate-500)
  - Spacing: generous padding (p-6), consistent gaps
  - Buttons: primary blue, secondary neutral, hover/focus states
- Add loading skeletons for stats and tables, empty states with icons, and toasts for feedback.
- Make it responsive: sidebar collapses on mobile (hamburger button).

PROJECT STRUCTURE (suggested)
- app/(auth)/login/page.tsx
- app/(protected)/layout.tsx  <-- sidebar/topbar layout
- app/(protected)/dashboard/page.tsx
- app/(protected)/upload/page.tsx
- app/(protected)/invoices/page.tsx
- app/(protected)/invoice/[id]/page.tsx
- lib/api.ts (fetch helpers)
- lib/auth.ts (auth helpers)
- components/Sidebar.tsx, Topbar.tsx, StatCard.tsx, InvoiceTable.tsx, UploadDropzone.tsx

IMPORTANT
- Generate all necessary components and pages with working navigation.
- Use clean TypeScript types for invoice data (define an Invoice interface; handle missing fields safely).
- Use environment variable NEXT_PUBLIC_API_BASE_URL with fallback to http://localhost:8080.
- Ensure the UI looks polished and close to the screenshot style.
