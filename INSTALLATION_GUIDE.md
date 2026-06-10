# Panduan Instalasi Campus Care

Panduan ini akan membantu Anda mengonfigurasi dan menjalankan aplikasi Campus Care di lingkungan lokal (development). Aplikasi ini terdiri dari dua bagian utama:
1. **Backend**: Laravel (PHP)
2. **Frontend**: React + Vite (Node.js)

---

## 📋 Persyaratan Sistem

Pastikan sistem Anda sudah terinstal perangkat lunak berikut sebelum memulai:
- **PHP** (minimal versi 8.2 atau yang lebih baru)
- **Composer** (untuk manajemen dependensi PHP)
- **Node.js** (minimal versi 18 atau 20 LTS)
- **NPM** atau **PNPM** (manajer paket Node.js)

---

## ⚙️ 1. Instalasi Backend (Laravel)

Ikuti langkah-langkah berikut untuk mengatur server API backend:

1. **Buka terminal dan navigasi ke folder backend:**
   ```bash
   cd backend
   ```

2. **Instal dependensi PHP menggunakan Composer:**
   ```bash
   composer install
   ```

3. **Salin file environment:**
   Buat salinan `.env.example` dan ubah namanya menjadi `.env`.
   ```bash
   cp .env.example .env
   ```
   *(Jika menggunakan Command Prompt Windows: `copy .env.example .env`)*

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Konfigurasi dan Migrasi Database (SQLite):**
   Secara default, aplikasi diatur untuk menggunakan database `sqlite` di `.env`. 
   Jalankan perintah migrasi beserta seeder (data awal):
   ```bash
   php artisan migrate --seed
   ```
   *(Pilih `yes` jika terminal bertanya apakah ingin membuat file database sqlite baru).*

6. **Jalankan Server Backend:**
   ```bash
   php artisan serve
   ```
   Backend API sekarang berjalan dan dapat diakses di `http://localhost:8000`. Biarkan terminal ini tetap terbuka.

---

## 🎨 2. Instalasi Frontend (React + Vite)

Buka jendela/tab terminal **baru** (jangan tutup terminal backend), lalu ikuti langkah-langkah berikut:

1. **Navigasi ke folder frontend:**
   ```bash
   cd frontend
   ```

2. **Instal dependensi Node.js:**
   Anda bisa menggunakan `npm` atau `pnpm`:
   ```bash
   npm install
   # atau
   pnpm install
   ```

3. **Jalankan Development Server Vite:**
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```

4. **Akses Aplikasi Web:**
   Secara default, Vite akan berjalan di port `5173` atau port terdekat lainnya. Buka browser Anda dan akses:
   `http://localhost:5173`

---

## ✅ Verifikasi Instalasi

Jika instalasi berhasil:
1. Pastikan kedua server (Terminal Backend dan Terminal Frontend) berjalan secara bersamaan tanpa pesan *Error*.
2. Kunjungi `http://localhost:8000/api/health` di browser. Anda seharusnya melihat respons JSON dari API (menandakan Backend hidup).
3. Buka `http://localhost:5173` untuk melihat tampilan web *Campus Care*. Coba masuk ke halaman registrasi atau login untuk memastikan koneksi frontend ke backend sudah tersambung.
