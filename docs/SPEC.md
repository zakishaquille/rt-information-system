# Spec: RTIS (Sistem Informasi Administrasi RT)

## Objective
Membangun aplikasi terpusat untuk mengelola administrasi RT (penghuni, rumah, iuran satpam & kebersihan, pengeluaran) yang memungkinkan RT mencatat keuangan dengan efisien, serta memungkinkan warga melihat status tagihan dan laporan keuangan secara transparan tanpa perlu login.

## Tech Stack
- **Backend:** Laravel 12.x (PHP)
- **Frontend:** React 19.x (Vite) with strict TypeScript, Zustand, Tailwind CSS 4.x
- **Database:** MySQL 8.x

## Commands
```bash
# Backend (Root Directory)
composer install
php artisan serve
php artisan test
php artisan migrate --seed

# Frontend (inside /frontend)
npm install
npm run dev
npm run build
npm run lint
```

## Project Structure
```text
/                 → Laravel Root (Backend)
  app/
    Http/         → Controllers, Middleware, Requests, Resources
    Services/     → Business logic layer (Payment calculation, etc.)
    Repositories/ → Data access abstraction
    Models/       → Eloquent models
    Enums/        → PHP Enums (Payment status, Transaction type)
  routes/
    api.php       → Protected admin routes
    api-public.php→ Public accessible routes
  database/       → Migrations, Seeders
/frontend         → React Root (Frontend)
  src/
    api/          → API client wrapper (Axios/Fetch)
    components/   → Reusable UI components
    features/     → Feature modules (residents, houses, payments)
    stores/       → Zustand global stores (Auth, Notifications)
    pages/        → Route components
```

## Code Style
### Backend (Laravel)
Keep controllers thin by pushing business logic into Services and data access into Repositories.
```php
// app/Http/Controllers/ResidentController.php
class ResidentController extends Controller {
    public function store(StoreResidentRequest $request, ResidentService $service) {
        $resident = $service->createResident($request->validated());
        return new ResidentResource($resident);
    }
}
```

### Frontend (React)
Use feature-based architecture and custom hooks for server state. Strictly use TypeScript with no `any` datatype.
```tsx
// src/features/residents/hooks/useResidents.ts
export const useResidents = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    // Fetch logic here...
    return { residents };
};
```

## Testing Strategy
- **Backend:** 
  - PHPUnit/Pest for Unit Tests (focusing on `Services` like `PaymentService` to ensure annual payment logic is bulletproof).
  - Feature tests for all API endpoints to ensure validation and correct response structures.
- **Frontend:** 
  - Vitest for utility functions and complex custom hooks.
  - Manual testing for UI components, potentially adding E2E (Playwright) later for the critical "Catat Pembayaran" flow.

## Boundaries
- **Always do:** 
  - Use DB Transactions (`DB::transaction`) for operations that span multiple tables or records (e.g., generating 12 monthly payment records for an annual payment).
  - Use Form Requests to validate all incoming API data.
  - Enforce soft-deletes on Residents and Payments to preserve historical integrity.
- **Ask first:** 
  - Altering the database schema or relationships (especially around the payment matrix).
  - Adding new third-party dependencies (npm or composer).
- **Never do:** 
  - Expose the `ADMIN_PASSWORD` or any `.env` secrets to the frontend.
  - Delete a resident from the database if they have ever been assigned to a house.
  - Remove failing tests without understanding and fixing the root cause.

## Success Criteria
- [ ] Admin (RT) can successfully authenticate using the environment password.
- [ ] Admin can perform full CRUD on Residents, Houses, Transactions, and record Payments.
- [ ] Annual payments correctly generate 12 individual monthly payment records linked to the specific house, resident, and selected due type.
- [ ] Public URLs (`/tagihan/{uuid}` and `/laporan`) load correctly without authentication and do not leak sensitive data.
