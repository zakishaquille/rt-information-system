# RTIS (Sistem Informasi Administrasi RT)

RTIS adalah aplikasi terpusat untuk mengelola administrasi RT, termasuk data penghuni, rumah, iuran (satpam & kebersihan), pengeluaran, serta memungkinkan warga melihat status tagihan dan laporan keuangan secara transparan.

Proyek ini dibangun menggunakan arsitektur *decoupled* yang memisahkan direktori backend dan frontend:
- **Backend:** Laravel (PHP, MySQL)
- **Frontend:** React (Vite, TypeScript, Tailwind CSS v4, Zustand)

---

## Persyaratan Sistem (Prerequisites)

Sebelum memulai instalasi, pastikan environment development Anda sudah terpasang:
- **PHP** (v8.2+)
- **Composer**
- **Node.js** (v20+) & **npm**
- **MySQL** Server

### Instalasi Persyaratan di macOS (menggunakan Homebrew)
Buka Terminal dan jalankan perintah berikut:
```bash
# Instal PHP dan Composer
brew install php composer

# Instal Node.js
brew install node

# Instal MySQL dan jalankan service-nya
brew install mysql
brew services start mysql
```

### Instalasi Persyaratan di Windows
Bagi pengguna Windows, Anda dapat menginstal satu per satu atau menggunakan tools terintegrasi:
1. **PHP & MySQL:** Instal [XAMPP](https://www.apachefriends.org/download.html). Pastikan untuk menambahkan *path* PHP ke dalam *Environment Variables* Windows Anda.
2. **Composer:** Unduh dan jalankan Windows Installer dari [getcomposer.org](https://getcomposer.org/download/).
3. **Node.js:** Unduh dan instal Windows Installer (versi LTS) dari [nodejs.org](https://nodejs.org/).

---

## Panduan Instalasi & Setup Environment (Developer Onboarding)

Berikut adalah langkah-langkah untuk menjalankan project ini secara lokal di device Anda.

### 1. Setup Backend (Laravel)
Seluruh kode backend berada di dalam folder `backend/`.

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal semua dependensi PHP via Composer:
   ```bash
   composer install
   ```
3. Salin file konfigurasi environment (jika belum ada):
   ```bash
   cp .env.example .env
   ```
4. Generate *application key*:
   ```bash
   php artisan key:generate
   ```
5. Buka file `.env` di folder backend, kemudian pastikan konfigurasi berikut sesuai:
   ```env
   # Konfigurasi Database (Gunakan root dan sesuaikan password Anda)
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=rtis
   DB_USERNAME=root
   DB_PASSWORD=password_db_anda
   
   # Password statis yang akan digunakan untuk login Admin RT
   ADMIN_PASSWORD=secret
   
   # Konfigurasi CORS & Sanctum SPA untuk Frontend
   FRONTEND_URL=http://localhost:5173
   SANCTUM_STATEFUL_DOMAINS=localhost:5173
   ```
6. Jalankan perintah migrasi. Karena database `rtis` belum ada, Laravel akan otomatis bertanya apakah Anda ingin membuatnya. Ketik `yes` dan tekan Enter:
   ```bash
   php artisan migrate
   ```
   *(Tambahkan opsi `--seed` jika seeder tersedia: `php artisan migrate --seed`)*
7. Jalankan lokal server backend:
   ```bash
   php artisan serve
   ```
   *Backend API sekarang bisa diakses di `http://localhost:8000`.*

### 3. Setup Frontend (React / Vite)
Seluruh kode frontend berada di dalam folder `frontend/`. Buka tab terminal baru agar server backend tetap berjalan.

1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Salin file environment dan sesuaikan URL backend (opsional, jika berbeda):
   ```bash
   cp .env.example .env
   ```
   *Secara default `.env` berisi `BACKEND_URL=http://localhost:8000`.*
3. Instal semua dependensi npm:
   ```bash
   npm install
   ```
4. Jalankan server frontend:
   ```bash
   npm run dev
   ```
   *Frontend UI sekarang bisa diakses di `http://localhost:5173`.*

---

## Catatan Teknis (Yang Dilakukan Saat Scaffolding)

Bagi developer yang berkontribusi, berikut adalah rekap cara kerja scaffolding awal pada Task 1.1:

- **Directory Separation:** Sistem di-*scaffold* menggunakan `composer create-project laravel/laravel` dan `npm create vite@latest`, kemudian kode laravel dipisahkan secara murni ke folder `backend` agar tidak tercampur dengan ekosistem node (Vite).
- **Sanctum SPA Authentication:**
  - Login tidak memvalidasi akun User konvensional. Melainkan, ketika frontend hit ke `/login` mengirim password, backend hanya mencocokkan password tersebut dengan nilai `ADMIN_PASSWORD` di `.env`. 
  - Jika cocok, sistem menggunakan fitur _First or Create_ untuk membuat akun `Admin RT` bayangan di database, lalu meregistrasi session-nya via `Auth::login($user)`.
  - Frontend kemudian mendapatkan HTTP-Only Cookie untuk state session tanpa token ekspos (JWT).
- **CORS & CSRF:**
  - Laravel API diset menggunakan middleware `statefulApi` di `bootstrap/app.php`. 
  - Host `localhost:5173` sudah terotorisasi via file `config/cors.php`.
  - Proses API dari Frontend (*Fetch API wrapper* di `src/api/client.ts`) akan wajib memanggil _endpoint_ `GET /sanctum/csrf-cookie` setiap sebelum operasi _POST_/_PUT_/_DELETE_ ke server untuk mengambil Cookie CSRF. Fetch juga diatur dengan `credentials: 'include'`.
- **Fetch Client (ky):** Seluruh integrasi API wajib menggunakan _HTTP client_ modern `ky` (yang membungkus native `fetch`). Kustomisasi diatur pada `src/api/client.ts` untuk menggunakan *hooks* `beforeRequest` yang membaca cookie dan mengirim header CSRF secara mandiri.
