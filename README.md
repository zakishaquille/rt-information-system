# RTIS (Sistem Informasi Administrasi RT)

RTIS (Sistem Informasi Administrasi RT) is a centralized web application designed to manage neighborhood (RT) administration efficiently. It allows RT administrators to manage resident data, houses, standard dues (security and cleaning), operational expenses, and payments. Additionally, it provides a transparent, read-only public portal where residents can check their billing status and view neighborhood financial reports without needing to log in.

## 🛠 Tech Stack

- **Backend:** Laravel 13.x
- **Frontend:** React 19.x with strict TypeScript, Zustand, Tailwind CSS 4.x (Vite)
- **Database:** MySQL 8.x

## 🗄 Database Schema (ERD)

```mermaid
---
title: RTIS ERD
config:
    layout: elk
---
erDiagram
    residents {
        int id PK
        string full_name
        string ktp_photo_path
        enum status "tetap | kontrak"
        string phone_number
        boolean is_married
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }

    houses {
        int id PK
        uuid uuid UK "untuk public URL"
        string code UK "nomor rumah"
        string address
        enum status "dihuni | tidak_dihuni"
        timestamp created_at
        timestamp updated_at
    }

    house_residents {
        int id PK
        int house_id FK
        int resident_id FK
        boolean is_pic "penanggung jawab"
        date moved_in_at
        date moved_out_at "nullable"
        timestamp created_at
        timestamp updated_at
    }

    due_type_rates {
        int id PK
        string name "nama jenis iuran bebas, cth: satpam, kebersihan, sampah"
        decimal amount "tarif per bulan"
        date effective_from "tanggal mulai berlaku; selalu diisi server dengan hari ini"
        date effective_to "nullable — null = masih aktif"
        timestamp created_at
        timestamp updated_at
    }

    payments {
        int id PK
        int house_id FK
        int resident_id FK
        int due_type_rate_id FK "tarif saat bayar"
        decimal amount "nominal dibayar"
        string period_month "YYYY-MM, bulan yang dibayar"
        date payment_date
        text notes "nullable"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }

    transaction_categories {
        int id PK
        enum type "expense | income"
        string name
        timestamp created_at
        timestamp updated_at
    }

    transactions {
        int id PK
        int transaction_category_id FK
        date date
        decimal amount
        string name
        text note "nullable"
        timestamp created_at
        timestamp updated_at
    }

    houses ||--o{ house_residents : "memiliki"
    residents ||--o{ house_residents : "menghuni"
    houses ||--o{ payments : "tagihan"
    residents ||--o{ payments : "membayar"
    due_type_rates ||--o{ payments : "tarif berlaku"
    transaction_categories ||--o{ transactions : "kategori"
```

- `users`: Stores administrator authentication (RT admin).
- `houses`: Stores house information (block, number, status) and uniquely generated UUID for public access.
- `residents`: Stores resident details, including private KTP images.
- `house_resident`: Pivot table tracking the assignment of residents to houses (many-to-many) with move-in/move-out history.
- `due_type_rates`: Manages dynamically created due types and their active rates over time.
- `transaction_categories`: Defines categories for operational income and expenses.
- `payments`: Tracks monthly dues payments tied to a specific house and due type rate.
- `transactions`: Records other operational income and expenses outside of standard dues.

## ⚙️ Quick Start

### macOS Setup
1. **Clone the repository**
2. **Setup Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Update DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env
   # Set ADMIN_PASSWORD for the dashboard login

   composer install
   php artisan key:generate
   php artisan storage:link
   php artisan migrate:fresh --seed
   php artisan serve
   ```
3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Set VITE_API_URL=http://localhost:8000

   npm run dev
   ```

### Windows Setup
1. **Clone the repository**
2. **Setup Backend:**
   ```cmd
   cd backend
   copy .env.example .env
   # Update DB configurations and ADMIN_PASSWORD in .env

   composer install
   php artisan key:generate
   php artisan storage:link
   php artisan migrate:fresh --seed
   php artisan serve
   ```
3. **Setup Frontend:**
   ```cmd
   cd frontend
   npm install
   copy .env.example .env
   # Set VITE_API_URL=http://localhost:8000

   npm run dev
   ```

## 🏗 Architecture

RTIS is built with a decoupled architecture:
- **Backend (Laravel):** Acts purely as an API server, utilizing Sanctum for SPA cookie-based authentication. Business logic is abstracted into Services, keeping Controllers thin. KTP images are stored in the private disk and served through protected API endpoints.
- **Frontend (React):** A Single Page Application (SPA) utilizing Vite, fetching data from the backend via standard REST endpoints. State is managed with custom hooks and Zustand. It implements strict route guarding for the dashboard and allows public routing for reporting.

## 🚀 Features & Application Demo

Below is a detailed breakdown of all the features implemented in RTIS, accompanied by screenshots demonstrating the application's functionality.

### 1. Authentication & Security
The application features a secure admin panel protected by a cookie-based SPA authentication system (Laravel Sanctum). Only authorized neighborhood administrators can access the system.
![Login](docs/screenshots/01-login.png)

### 2. Dashboard & Financial Overview
The Dashboard provides an immediate overview of the neighborhood's financial health, including:
- Total Running Balance (Kas).
- Income and Expenses for the current month.
- House Occupancy metrics.
- A 12-month historical bar chart comparing Income vs. Expenses.

![Dashboard](docs/screenshots/02-dashboard.png)

### 3. House Management
Administrators can add, edit, and view all houses within the neighborhood, tracking whether they are occupied or empty.

![Houses List](docs/screenshots/03-houses-list.png)

**House Details & History:** Clicking on a house reveals its full payment history for the year and a log of past and present residents who have lived there.

![House Detail](docs/screenshots/04-house-detail.png)
![House History](docs/screenshots/16-house-history.png)

### 4. Resident Management
A comprehensive list of all registered residents. Administrators can securely upload KTP images (which are stored in private local disks to prevent public exposure).
![Residents List](docs/screenshots/05-residents-list.png)

**Resident Registration:** A clean modal form allows for quick data entry and house assignment. Residents can have their KTP photos securely uploaded and previewed within the system.

![Resident Form](docs/screenshots/06-resident-form.png)

### 5. App Configurations
Dynamic management of default transaction categories and standard monthly dues (e.g., Satpam & Kebersihan). Administrators can set active rates, and the system automatically closes legacy rates to preserve historical payment integrity.
![Configurations](docs/screenshots/07-configurations.png)

### 6. Monthly Payments Matrix
The core of the financial system. A powerful matrix table that tracks the payment status of every occupied house for every month of the year. It supports full payments, partial installments, and annual batch payments.
![Payments Matrix](docs/screenshots/08-payments-matrix.png)

**Recording Payments:** Clicking on a pending month cell opens a modal to easily record a payment for that house and period.

![Payment Modal](docs/screenshots/14-payment-modal.png)

**Billing URLs Generation Tool:** An efficient tool designed to generate a copy-paste ready list of public payment URLs for all residents with arrears in a specific month, optimized for sharing via WhatsApp.

![Generate Billing](docs/screenshots/09-generate-billing.png)

### 7. Operational Transactions
Records for operational incomes and expenses outside of standard monthly dues. Includes categorization for clean financial reporting.

![Transactions List](docs/screenshots/10-transactions-list.png)

**Record Transaction:** Easy-to-use form to log cash inflows and outflows.

![Transaction Form](docs/screenshots/11-transaction-form.png)

### 8. Public Transparency Portal
Residents have access to specific views without needing to log in, ensuring maximum transparency.

**Public Billing Page:** A unique URL for each house allowing residents to view their exact payment history, dues breakdown, and any outstanding arrears.

![Public Billing](docs/screenshots/12-public-billing.png)

**Public Financial Report:** A high-level overview of the neighborhood's finances, providing charts and expense breakdowns to show residents exactly how RT funds are being utilized.

![Public Report](docs/screenshots/13-public-report.png)

### 9. Fully Responsive & Mobile-Friendly
The entire web application from complex payment matrices to public portals is fully responsive, ensuring RT administrators and residents have a seamless experience on any device down to mobile view.

<img src="docs/screenshots/14-mobile-view-1.png" alt="Mobile View 1" width="30%" height="auto">
<img src="docs/screenshots/14-mobile-view-2.png" alt="Mobile View 2" width="30%" height="auto">
<img src="docs/screenshots/14-mobile-view-3.png" alt="Mobile View 3" width="30%" height="auto">
