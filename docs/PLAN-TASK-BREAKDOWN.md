# Implementation Plan: RTIS (Sistem Informasi Administrasi RT)

## Overview
Breaking down the RTIS specification into vertically sliced, implementable tasks aligned with the PRD and Backlog. The project consists of a separated Laravel backend API and React/Vite frontend SPA, focusing on managing residents, houses, monthly dues, expenses, and public financial reporting.

## Architecture Decisions
- **Separated Repositories/Directories:** Backend (Laravel) and Frontend (React/Vite) will be strictly separated into different directories and run on different ports during development.
- **Sanctum SPA Authentication:** We will use Laravel Sanctum for cookie-based session authentication for the admin after validating the `.env` password.
- **Local Private Storage for KTP:** KTP images will be stored in the private `local` disk and served through a protected API endpoint to ensure data privacy.
- **Strict MySQL & Seeding:** The project strictly uses MySQL. All database schema implementations must include Laravel Migrations, Factories, and Seeders to ensure test and dummy data are always reproducible.
- **Vertical Slicing:** Features will be implemented full-stack (Backend Migration/Seeder -> API -> Frontend UI) to ensure each task delivers testable, working functionality.

## Task List

### Phase 1: Foundation & Base Data
- [x] **Task 1.1: Project Scaffolding & Authentication (Foundation)**
  - **Description:** Initialize Laravel (MySQL configured) and React projects, set up Sanctum SPA auth using the `.env` password, and build the Login UI.
  - **Acceptance criteria:**
    - [x] Laravel API responds to a login request using `ADMIN_PASSWORD` and sets a session cookie.
    - [x] React frontend has a login page that authenticates and redirects to an empty dashboard.
  - **Verification:** 
    - [x] Manual check: Can log in with correct password, fails with incorrect.
  - **Dependencies:** None
  - **Files likely touched:** `backend/routes/api.php`, `backend/app/Http/Controllers/AuthController.php`, `frontend/src/features/auth/*`
  - **Estimated scope:** Medium

- [x] **Task 1.2: House Management (Story 2)**
  - **Description:** Implement backend models, API, and frontend UI to list and manage houses (UUID generation, status). Includes migrations, factories, and seeders for houses.
  - **Acceptance criteria:**
    - [x] Backend generates a UUID for each new house automatically.
    - [x] Database is seeded with 20 dummy houses (15 occupied, 5 empty).
    - [x] RT can view, add, and edit houses via the frontend.
    - [x] RT can view the full payment history for each house, showing the breakdown of dues, payer resident name/details, payment date, and status (lunas/belum) for each billing period.
  - **Verification:** 
    - [x] Tests pass: `php artisan test --filter House`
    - [x] DB Seeder: `php artisan db:seed --class=HouseSeeder` runs successfully.
    - [x] Manual check: Add a house detail view/modal showing payment history and check it loads historical payments correctly.
  - **Dependencies:** Task 1.1
  - **Files likely touched:** `backend/database/migrations/*houses_table.php`, `backend/database/factories/HouseFactory.php`, `backend/database/seeders/HouseSeeder.php`, `backend/app/Models/House.php`, `frontend/src/features/houses/*`
  - **Estimated scope:** Medium

- [x] **Task 1.3: Resident Management & House Assignment (Story 1 & Story 2)**
  - **Description:** Implement Resident CRUD with private KTP upload, and the ability to assign residents to houses (many-to-many with history). Includes migrations and seeders.
  - **Acceptance criteria:**
    - [x] KTP photos upload to private disk and can be fetched via protected API.
    - [x] RT can assign residents to a house and designate a PIC.
    - [x] Removing a resident records the `moved_out_at` date.
    - [x] Database is seeded with dummy residents assigned to the 15 occupied houses.
    - [x] RT can view the list of historical residents (move-in and move-out logs) in the house management view/modal.
  - **Verification:** 
    - [x] Manual check: Upload resident with image, assign to house, verify image loads in UI.
    - [x] Manual check: Unassign resident, then verify they appear in the historical resident list.
  - **Dependencies:** Task 1.2
  - **Files likely touched:** `backend/database/migrations/*residents_table.php`, `backend/database/seeders/ResidentSeeder.php`, `backend/app/Http/Controllers/ResidentController.php`, `frontend/src/features/residents/*`
  - **Estimated scope:** Large

- [x] **Task 1.4: App Configurations (Rates & Categories) (Story 3)**
  - **Description:** CRUD for `due_type_rates` (jenis iuran bebas, default: Satpam & Kebersihan) and `transaction_categories`. Includes migrations and seeders for default rates/categories.
  - **Acceptance criteria:**
    - [x] RT dapat **menambah jenis iuran baru** (free-form name, tidak dibatasi Satpam/Kebersihan).
    - [x] Tarif baru selalu berlaku mulai hari ini (server-side, tidak ada input tanggal manual).
    - [x] Status tarif: **Aktif** (`effective_to` null atau ≥ hari ini) vs **Expired** (`effective_to` < hari ini).
    - [x] Saat tarif baru dibuat, tarif aktif untuk jenis yang sama otomatis ditutup: `effective_to` = hari ini − 1 hari.
    - [x] RT dapat menghapus tarif Aktif. Tarif Expired tidak bisa dihapus.
    - [x] Tampilan grid iuran hanya memunculkan jenis iuran yang memiliki tarif Aktif.
    - [x] Histori tarif tersimpan di DB; perubahan tarif tidak mempengaruhi tagihan yang sudah dibuat.
    - [x] RT dapat kelola kategori pengeluaran & pemasukan (tambah/edit/hapus nama; tipe immutable setelah dibuat).
    - [x] Database seeded: Satpam Rp 100.000, Kebersihan Rp 15.000; default expense & income categories.
  - **Verification:** 
    - [x] Tests pass: `DueTypeRateTest` (11 tests), `TransactionCategoryTest` (8 tests).
    - [x] Manual check: Set tarif baru → langsung aktif; tarif sebelumnya otomatis expired.
  - **Dependencies:** Task 1.1
  - **Files touched:** `migrations/..._create_due_type_rates_table`, `migrations/..._create_transaction_categories_table`, `Models/DueTypeRate`, `Models/TransactionCategory`, `Seeders/DueTypeRateSeeder`, `Seeders/TransactionCategorySeeder`, `Controllers/DueTypeRateController`, `Controllers/TransactionCategoryController`, `Requests/StoreDueTypeRateRequest`, `features/configurations/*`
  - **Estimated scope:** Medium

### Checkpoint: Foundation
- [x] Backend tests for Auth, Houses, Residents, Configurations pass.
- [x] Database successfully migrates and seeds from scratch (`php artisan migrate:fresh --seed`).
- [x] Admin can log in, view seeded houses and residents, configure rates.

---

### Phase 2: Core Financials
- [x] **Task 2.1: Monthly Payment Recording (Matrix View) (Story 4)**
  - **Description:** Implement the core billing matrix and standard monthly payment recording. Includes dummy payment seeding. Features include "Bayar Semua", "Batal", and Search filtering.
  - **Acceptance criteria:**
    - [x] API returns a matrix data structure of houses vs months for the current year.
    - [x] Frontend displays the Matrix table (Lunas/Partial/Belum) with resident PIC logic.
    - [x] RT can record a full monthly payment which captures the currently active rate, or revert it.
    - [x] Database seeded with historical payment data for the dummy houses.
  - **Verification:** 
    - [x] Tests pass: `php artisan test --filter PaymentServiceTest`
  - **Dependencies:** Task 1.3, Task 1.4
  - **Estimated scope:** Large

- [x] **Task 2.2: Annual Payments (Story 5)**
  - **Description:** Enhance payment logic to handle 1-year batch payments for each due type.
  - **Acceptance criteria:**
    - [x] Annual payment creates 12 distinct monthly payment records for a specific due type inside a DB transaction.
  - **Verification:** 
    - [x] Tests pass: Verify annual payment splits correctly for the selected due type.
  - **Dependencies:** Task 2.1
  - **Estimated scope:** Medium

- [x] **Task 2.3: Other Transactions (Story 6)**
  - **Description:** Backend: `create_transactions_table`, `TransactionController` (index, store, update, destroy). Include basic dummy transactions seeding. Frontend: `TransactionsList` component + modal for Create/Edit Transaction. Allow recording non-due expenses/incomes.
  - **Acceptance criteria:**
    - [x] RT can record operational expenses (e.g., satpam salary) and view the transaction list.
    - [x] DB seeded with dummy expense/income transactions.
  - **Verification:** 
    - [x] Manual check: Record an expense and income, and verify they appear on the transaction list.
  - **Dependencies:** Task 2.1
  - **Estimated scope:** Medium

### Checkpoint: Core Financials
- [x] All financial operations (Payments, Expenses) work correctly and data seeds perfectly.
- [x] Balances calculate properly based on seeded data.

---

### Phase 3: Reporting & Public Access

- [x] **Task 3.1: Dashboard Statistics & Chart API (Backend)**
  - **Description:** Implement backend endpoints to calculate and return dashboard statistics: current month's financial summary, house occupancy, total running balance, and 12-month income vs expenses chart data.
  - **Acceptance criteria:**
    - [x] `GET /api/dashboard/stats` returns accurate calculations for total balance (which can be negative).
    - [x] Endpoint returns an array of monthly data (income vs expenses) for the past 12 months.
  - **Verification:**
    - [x] Tests pass: `php artisan test --filter DashboardTest`
    - [x] Manual check: Hit endpoint with Postman/Insomnia and verify calculations against DB.
  - **Dependencies:** Task 2.3
  - **Files likely touched:**
    - `backend/routes/api.php`
    - `backend/app/Http/Controllers/DashboardController.php`
    - `backend/app/Services/DashboardService.php`
    - `backend/tests/Feature/DashboardTest.php`
  - **Estimated scope:** Medium

- [x] **Task 3.2: Dashboard UI Components & Integration (Frontend)**
  - **Description:** Build the frontend React Dashboard page to display statistics cards and financial charts using the data from the new API.
  - **Acceptance criteria:**
    - [x] Dashboard displays Total Balance, Income this month, and Expense this month in clear stat cards.
    - [x] 12-month bar/line chart accurately renders the income vs. expense data.
  - **Verification:**
    - [x] Build succeeds: `npm run build`
    - [x] Manual check: Load the dashboard and visually validate charts against seeded dummy data.
  - **Dependencies:** Task 3.1
  - **Files likely touched:**
    - `frontend/src/pages/DashboardPage.tsx`
    - `frontend/src/features/dashboard/components/*`
    - `frontend/src/features/dashboard/api/*`
  - **Estimated scope:** Medium

- [x] **Task 3.3: Public Billing API & UI (Story 9)**
  - **Description:** Implement the read-only public billing page for residents. They can view their house's billing status via a unique URL without logging in.
  - **Acceptance criteria:**
    - [x] Backend `GET /api-public/houses/{uuid}` returns house and payment status without authentication.
    - [x] Frontend `/tagihan/{uuid}` displays payment history for the current year (dues breakdown, payment dates, payer, and lunas/belum/partial status).
    - [x] Personal data (like KTP) is strictly NOT exposed in the public API.
  - **Verification:**
    - [x] Tests pass: `php artisan test --filter PublicBillingTest`
    - [x] Manual check: Access public URL in an incognito window and verify the UI.
  - **Dependencies:** Task 2.1
  - **Files likely touched:**
    - `backend/routes/api-public.php`
    - `backend/app/Http/Controllers/PublicHouseController.php`
    - `backend/app/Http/Resources/PublicHouseResource.php`
    - `frontend/src/pages/PublicBillingPage.tsx`
    - `frontend/src/features/public/*`
  - **Estimated scope:** Medium

- [x] **Task 3.4: Generate Billing URLs Tool (Story 8)**
  - **Description:** Build a tool for the RT admin to generate a copy-paste ready list of billing URLs for all occupied houses, filtered by month.
  - **Acceptance criteria:**
    - [x] RT can view a list of all occupied houses with outstanding dues for a selected month.
    - [x] List includes house number, PIC name, arrears amount, and the unique public URL.
    - [x] A "Copy to Clipboard" button formats the list nicely for WhatsApp sharing.
  - **Verification:**
    - [x] Manual check: Select a month, generate the list, click copy, and paste into a text editor to verify formatting.
  - **Dependencies:** Task 3.3
  - **Files likely touched:**
    - `frontend/src/features/payments/components/GenerateBillingModal.tsx`
  - **Estimated scope:** Small

- [x] **Task 3.5: Public Financial Report API & UI (Story 10)**
  - **Description:** Implement a public read-only financial report so residents can see where RT funds are spent.
  - **Acceptance criteria:**
    - [x] Backend `GET /api-public/reports` returns necessary chart and breakdown data without authentication.
    - [x] Frontend `/laporan` displays the income vs. expense chart and category breakdowns.
  - **Verification:**
    - [x] Tests pass: `php artisan test --filter PublicReportTest`
    - [x] Manual check: Access `/laporan` in an incognito window and verify charts render correctly.
  - **Dependencies:** Task 3.1
  - **Files likely touched:**
    - `backend/routes/api-public.php`
    - `backend/app/Http/Controllers/PublicReportController.php`
    - `frontend/src/pages/PublicReportPage.tsx`
  - **Estimated scope:** Small

### Checkpoint: Reporting & Public Access
- [x] Dashboard charts load accurately with real calculations.
- [x] Public URLs (`/tagihan/{uuid}` and `/laporan`) load correctly without auth.
- [x] No sensitive data (e.g., KTP, phone numbers) is leaked in public endpoints.

---

### Phase 4: Finalization & Polish

- [x] **Task 4.1: UI Polish, Loading States, & Error Handling**
  - **Description:** Systematically review all frontend pages to ensure loading states (skeletons/spinners) are present, errors are handled gracefully via toasts, and UI is responsive on mobile.
  - **Acceptance criteria:**
    - [x] All API requests have visible loading states.
    - [x] Global error interceptor displays user-friendly toast notifications for 4xx/5xx errors.
    - [x] Forms have proper client-side validation and display validation errors inline.
  - **Verification:**
    - [x] Manual check: Throttle network in DevTools to verify loading states.
    - [x] Manual check: Trigger intentional errors (e.g., submit empty form) to verify toasts/inline errors.
  - **Dependencies:** All previous tasks.
  - **Files likely touched:**
    - `frontend/src/api/client.ts`
    - `frontend/src/components/ui/*`
    - Various form components across features.
  - **Estimated scope:** Medium

- [x] **Task 4.2: Comprehensive Seeding for Realistic Demo**
  - **Description:** Enhance the backend DatabaseSeeder to generate a rich, realistic dataset for demonstration purposes.
  - **Acceptance criteria:**
    - [x] Seeder generates 20 houses (15 occupied, 5 empty).
    - [x] Seeder creates past payments spanning at least 12 months with a mix of lunas, partial, and belum statuses.
    - [x] Seeder generates random operational expenses and other incomes so the financial charts look realistic.
  - **Verification:**
    - [x] Build succeeds: `php artisan migrate:fresh --seed` runs without errors.
    - [x] Manual check: Login as admin and verify the dashboard charts are populated with data.
  - **Dependencies:** Task 3.5
  - **Files likely touched:**
    - `backend/database/seeders/*`
    - `backend/database/factories/*`
  - **Estimated scope:** Medium

- [x] **Task 4.3: End-to-End Testing & Bug Fixes**
  - **Description:** Perform full manual testing of all user flows based on the PRD, and fix any resulting bugs.
  - **Acceptance criteria:**
    - [x] All features from Phase 1-3 work together without errors.
    - [x] Backend tests coverage is sufficient.
  - **Verification:**
    - [x] Tests pass: `php artisan test`
    - [x] Manual check: Go through the RT admin flow and public resident flow end-to-end.
  - **Dependencies:** Task 4.1, Task 4.2
  - **Files likely touched:**
    - Various bug fixes across backend and frontend.
  - **Estimated scope:** Medium

- [ ] **Task 4.4: Documentation (README & Screenshots)**
  - **Description:** Write a comprehensive README with setup instructions and feature screenshots.
  - **Acceptance criteria:**
    - [ ] `README.md` includes local setup instructions for both Laravel and React.
    - [ ] `README.md` details the tech stack and database schema.
    - [ ] `README.md` includes screenshots of the Dashboard, Matrix View, and Public Tagihan page.
  - **Verification:**
    - [ ] Manual check: Verify markdown renders correctly and screenshots load.
  - **Dependencies:** Task 4.3
  - **Files likely touched:**
    - `README.md`
    - `docs/screenshots/*`
  - **Estimated scope:** Small

### Checkpoint: Complete
- [ ] Application is production-ready.
- [ ] `php artisan migrate:fresh --seed` produces a fully working demo environment.
- [ ] Documentation is complete.
- [ ] Ready for final sign-off.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex Matrix Query Performance | Low/Med | Standard Eloquent queries with eager loading will be fast for 20 houses. Will optimize the query to load all payments for the year at once and map them in memory rather than N+1 queries. |
| Annual Payment Logic Failures | High | Wrap annual payment insertion in a DB transaction. Write extensive backend unit tests for this specific logic. |
| KTP Data Leak | High | Ensure the local disk storage route is strictly protected by the Sanctum `auth:sanctum` middleware and is not accidentally symlinked to public. |
