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

- [/] **Task 1.2: House Management (Story 2)**
  - **Description:** Implement backend models, API, and frontend UI to list and manage houses (UUID generation, status). Includes migrations, factories, and seeders for houses.
  - **Acceptance criteria:**
    - [x] Backend generates a UUID for each new house automatically.
    - [x] Database is seeded with 20 dummy houses (15 occupied, 5 empty).
    - [x] RT can view, add, and edit houses via the frontend.
    - [ ] RT can view the full payment history for each house, showing the breakdown of dues, payer resident name/details, payment date, and status (lunas/belum) for each billing period.
  - **Verification:** 
    - [x] Tests pass: `php artisan test --filter House`
    - [x] DB Seeder: `php artisan db:seed --class=HouseSeeder` runs successfully.
    - [ ] Manual check: Add a house detail view/modal showing payment history and check it loads historical payments correctly.
  - **Dependencies:** Task 1.1
  - **Files likely touched:** `backend/database/migrations/*houses_table.php`, `backend/database/factories/HouseFactory.php`, `backend/database/seeders/HouseSeeder.php`, `backend/app/Models/House.php`, `frontend/src/features/houses/*`
  - **Estimated scope:** Medium

- [/] **Task 1.3: Resident Management & House Assignment (Story 1 & Story 2)**
  - **Description:** Implement Resident CRUD with private KTP upload, and the ability to assign residents to houses (many-to-many with history). Includes migrations and seeders.
  - **Acceptance criteria:**
    - [x] KTP photos upload to private disk and can be fetched via protected API.
    - [x] RT can assign residents to a house and designate a PIC.
    - [x] Removing a resident records the `moved_out_at` date.
    - [x] Database is seeded with dummy residents assigned to the 15 occupied houses.
    - [ ] RT can view the list of historical residents (move-in and move-out logs) in the house management view/modal.
  - **Verification:** 
    - [x] Manual check: Upload resident with image, assign to house, verify image loads in UI.
    - [ ] Manual check: Unassign resident, then verify they appear in the historical resident list.
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

- [ ] **Task 2.2: Annual Payments (Story 5)**
  - **Description:** Enhance payment logic to handle 1-year batch payments for each due type.
  - **Acceptance criteria:**
    - [ ] Annual payment creates 12 distinct monthly payment records for a specific due type inside a DB transaction.
  - **Verification:** 
    - [ ] Tests pass: Verify annual payment splits correctly for the selected due type.
  - **Dependencies:** Task 2.1
  - **Estimated scope:** Medium

- [ ] **Task 2.3: Other Transactions (Story 6)**
  - **Description:** Allow recording non-due expenses/incomes. Includes transaction dummy seeders.
  - **Acceptance criteria:**
    - [ ] RT can record operational expenses (e.g., satpam salary) and view the transaction list.
    - [ ] DB seeded with dummy expense/income transactions.
  - **Verification:** 
    - [ ] Manual check: Record an expense and income, and verify they appear on the transaction list.
  - **Dependencies:** Task 2.1
  - **Estimated scope:** Medium

### Checkpoint: Core Financials
- [ ] All financial operations (Payments, Expenses) work correctly and data seeds perfectly.
- [ ] Balances calculate properly based on seeded data.

---

### Phase 3: Reporting & Public Access
- [ ] **Task 3.1: Financial Dashboard & Reports (Story 7)**
  - **Description:** Build the RT dashboard and graphical reports using the seeded data.
  - **Acceptance criteria:**
    - [ ] Dashboard shows total balance (can be negative).
    - [ ] 12-month bar/line chart of incomes vs expenses displays accurately.
  - **Verification:** 
    - [ ] Manual check: Visual validation of charts against dummy data.
  - **Dependencies:** Task 2.3
  - **Estimated scope:** Medium

- [ ] **Task 3.2: Public Billing & Generate URLs (Story 8 & Story 9)**
  - **Description:** Public read-only page for house billing and RT tool to generate shareable list.
  - **Acceptance criteria:**
    - [ ] `/api-public/houses/{uuid}` returns billing status without authentication.
    - [ ] Frontend `/tagihan/{uuid}` displays status without exposing personal data.
    - [ ] Public billing page `/tagihan/{uuid}` displays detailed payment history for the current year (breakdown of dues, payment dates, payer resident name, and status lunas/belum/partial).
    - [ ] RT can generate a copy-paste ready list of billing URLs for all occupied houses.
  - **Verification:** 
    - [ ] Manual check: Access public URL in incognito window.
    - [ ] Manual check: Verify payment details and payer names are formatted correctly without leaking unnecessary private details (e.g., KTP).
  - **Dependencies:** Task 2.1
  - **Estimated scope:** Small

- [ ] **Task 3.3: Public Financial Report (Story 10)**
  - **Description:** Public read-only financial report.
  - **Acceptance criteria:**
    - [ ] `/api-public/reports` returns necessary chart data without authentication.
    - [ ] Frontend `/laporan` displays the charts for the public.
  - **Verification:** 
    - [ ] Manual check: Access report in incognito window.
  - **Dependencies:** Task 3.1
  - **Estimated scope:** Small

### Checkpoint: Public Access Complete
- [ ] Public URLs load correctly without auth and show accurate data.
- [ ] Admin dashboard and report generators function flawlessly.

---

### Phase 4: Finalization & Polish
- [ ] **Task 4.1: UI Polish & Error Handling**
  - **Description:** Refine UI/UX, ensure all edge cases are handled gracefully, and add comprehensive error messages/toast notifications.
  - **Acceptance criteria:**
    - [ ] Loading states and error toasts implemented across all forms and API interactions.
    - [ ] UI is responsive, intuitive, and aligns with the intended aesthetic.
  - **Dependencies:** All previous phases.
  - **Estimated scope:** Medium

- [ ] **Task 4.2: Comprehensive Testing & Bug Fixes**
  - **Description:** Perform full end-to-end manual testing of all features and fix any identified bugs. Ensure the complete data seeding works seamlessly to provide a realistic demo environment.
  - **Acceptance criteria:**
    - [ ] All features from Phase 1-3 work together without errors.
    - [ ] `php artisan migrate:fresh --seed` produces a fully working, realistic demo environment.
  - **Dependencies:** Task 4.1
  - **Estimated scope:** Medium

- [ ] **Task 4.3: Documentation (README & Screenshots)**
  - **Description:** Create a comprehensive README with step-by-step installation instructions, stack overview, and screenshots of key features.
  - **Acceptance criteria:**
    - [ ] `README.md` includes local setup instructions for both Laravel and React.
    - [ ] `README.md` includes screenshots of the Dashboard, Matrix View, and Public Tagihan page.
  - **Dependencies:** Task 4.2
  - **Estimated scope:** Small

### Checkpoint: Complete
- [ ] Application is production-ready (or ready for user handover).
- [ ] Documentation is complete.
- [ ] Ready for final sign-off.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex Matrix Query Performance | Low/Med | Standard Eloquent queries with eager loading will be fast for 20 houses. Will optimize the query to load all payments for the year at once and map them in memory rather than N+1 queries. |
| Annual Payment Logic Failures | High | Wrap annual payment insertion in a DB transaction. Write extensive backend unit tests for this specific logic. |
| KTP Data Leak | High | Ensure the local disk storage route is strictly protected by the Sanctum `auth:sanctum` middleware and is not accidentally symlinked to public. |
