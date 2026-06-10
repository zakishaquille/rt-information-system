## Backlog: RTIS (Sistem Informasi Administrasi RT)

**Format**: User Stories
**Total stories**: 10

### Stories

#### Story 1: Manajemen Data Penghuni
**Description:** As a Ketua RT, I want to add, edit, and list resident data (including KTP photo uploads and contract dates), so that I have an accurate and searchable record of everyone living in the neighborhood.

Acceptance Criteria:
- [ ] RT can view a paginated/searchable list of residents.
- [ ] RT can add a new resident with mandatory fields (Name, Phone, KTP photo up to 5MB) and optional fields (Contract dates, Marital status).
- [ ] RT can edit resident details.
- [ ] Resident data cannot be hard-deleted if assigned to a house (soft-delete only).

Priority: P0 | Effort: M | Dependencies: None

---

#### Story 2: Manajemen Data Rumah & Penghuni
**Description:** As a Ketua RT, I want to manage houses, view their occupancy status, and assign or remove residents, so that I know exactly who lives where and the history of occupancy.

Acceptance Criteria:
- [ ] RT can view a grid/list of houses with their current occupancy status.
- [ ] RT can assign multiple residents to a house and designate one as the PIC (Person In Charge).
- [ ] Removing all residents from a house automatically changes its status to "Tidak Dihuni".
- [ ] System automatically records the history (move-in/move-out dates) whenever residents are assigned or removed.
- [ ] Each house automatically gets a unique UUID for public sharing upon creation.
- [ ] RT can view a detailed house record/view showing the current residents, historical resident logs (name, moved-in, moved-out), and full payment history (dues, payer details, status).

Priority: P0 | Effort: M | Dependencies: Story 1

---

#### Story 3: Konfigurasi Tarif & Kategori
**Description:** As a Ketua RT, I want to configure the default monthly rates for security and cleaning dues, as well as manage income/expense categories, so that the system applies the correct settings for transactions.

Acceptance Criteria:
- [ ] RT can update the monthly rate for "Iuran Satpam" and "Iuran Kebersihan".
- [ ] Changes to rates are recorded with an effective date and do not affect past recorded payments.
- [ ] RT can add, edit, and delete custom transaction categories for expenses and other incomes.

Priority: P0 | Effort: S | Dependencies: None

---

#### Story 4: Pencatatan Pembayaran Iuran (Matrix View)
**Description:** As a Ketua RT, I want to view a matrix of houses vs. months to quickly record and track monthly security and cleaning dues, so I know who is in arrears.

Acceptance Criteria:
- [ ] RT can view a matrix table showing houses as rows and months (Jan-Dec) as columns.
- [ ] Matrix cells clearly show status: Lunas (Green), Partial (Yellow), Belum (Red).
- [ ] RT can click a cell to record a full payment for that month using the currently active rates.
- [ ] Payments are recorded linking to the House, the PIC resident, and the specific `period_month`.

Priority: P0 | Effort: L | Dependencies: Story 2, Story 3

---

#### Story 5: Pembayaran Tahunan
**Description:** As a Ketua RT, I want to process annual upfront payments for each due type, so that residents can pay for a whole year at once.

Acceptance Criteria:
- [ ] RT can select a 1-year payment option for a specific due type, which the system automatically expands into 12 separate monthly records for that due type.

Priority: P1 | Effort: M | Dependencies: Story 4

---

#### Story 6: Pencatatan Pemasukan Lain & Pengeluaran
**Description:** As a Ketua RT, I want to record operational expenses and non-dues incomes with categories and notes, so that all RT funds are properly accounted for.

Acceptance Criteria:
- [ ] RT can add an expense or income transaction with date, category, amount, title, and optional notes.
- [ ] RT can view a filterable list of all transactions (by month, date range, or category).
- [ ] The system calculates the running balance, allowing it to become negative if expenses exceed incomes (with visual indicator).

Priority: P0 | Effort: M | Dependencies: Story 3

---

#### Story 7: Dashboard & Laporan Keuangan RT
**Description:** As a Ketua RT, I want to view a dashboard with quick stats and detailed annual/monthly financial charts, so that I can easily analyze the neighborhood's financial health.

Acceptance Criteria:
- [ ] Dashboard displays current month's financial summary, house occupancy stats, and total running balance.
- [ ] Reports page shows a 12-month bar/line chart comparing incomes and expenses.
- [ ] Reports page provides a breakdown of expenses and incomes by category for any selected month.

Priority: P1 | Effort: L | Dependencies: Story 4, Story 6

---

#### Story 8: Generate & Bagikan Tagihan
**Description:** As a Ketua RT, I want to generate a list of billing URLs for all occupied houses for a specific month, so that I can easily copy-paste reminders to residents via WhatsApp.

Acceptance Criteria:
- [ ] RT can select a billing month and generate a list of all occupied houses with outstanding dues.
- [ ] The list displays the house number, PIC name, arrears amount, and the unique public URL.
- [ ] RT can click a "Copy" button to copy a pre-formatted reminder message containing the URL for each house.

Priority: P1 | Effort: S | Dependencies: Story 4

---

#### Story 9: Akses Publik Tagihan Warga
**Description:** As a Resident, I want to open a unique URL to see my house's billing information without logging in, so that I can verify my payment status and arrears independently.

Acceptance Criteria:
- [ ] Resident can access `/tagihan/{uuid}` without authentication.
- [ ] Page displays house info, PIC name, and payment status for each month of the current year.
- [ ] Page displays detailed payment history for each month of the current year (showing the breakdown of dues, payer resident information, payment date, and payment status for each due type).
- [ ] Page displays the total outstanding arrears clearly.
- [ ] Data is read-only; no modifications can be made from this page.

Priority: P0 | Effort: S | Dependencies: Story 2, Story 4

---

#### Story 10: Akses Publik Laporan Keuangan
**Description:** As a Resident, I want to view the RT's public financial report via a URL without logging in, so that I know exactly how our dues are being utilized.

Acceptance Criteria:
- [ ] Resident can access `/laporan` without authentication.
- [ ] Page displays the income vs. expense chart and category breakdowns similar to the RT's report, but read-only.
- [ ] Page does not expose individual house payment statuses or personal resident data.

Priority: P1 | Effort: S | Dependencies: Story 7

---

### Story Map
**Must-Have (MVP):**
- Story 1: Manajemen Data Penghuni
- Story 2: Manajemen Data Rumah & Penghuni
- Story 3: Konfigurasi Tarif & Kategori
- Story 4: Pencatatan Pembayaran Iuran (Matrix View)
- Story 6: Pencatatan Pemasukan Lain & Pengeluaran
- Story 9: Akses Publik Tagihan Warga

**Should-Have:**
- Story 5: Pembayaran Tahunan
- Story 7: Dashboard & Laporan Keuangan RT
- Story 8: Generate & Bagikan Tagihan
- Story 10: Akses Publik Laporan Keuangan

### Technical Notes
- **API & SPA**: Backend uses Laravel API. Frontend uses React Vite.
- **UUIDs**: House UUIDs are critical for public access and should be generated securely upon house creation.
- **Soft Deletes**: Used extensively (Residents, Payments) to maintain data integrity for historical reporting.
- **Transactions**: Complex operations like Annual Payment expansion need to be wrapped in DB transactions.
- **Auth**: Only one Admin user (Ketua RT) authenticated via simple ENV password validation middleware.
