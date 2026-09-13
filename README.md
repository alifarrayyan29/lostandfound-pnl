# Sistem Informasi Lost & Found PNL

Aplikasi web inovatif untuk melaporkan dan mencari barang hilang di lingkungan kampus Politeknik Negeri Lhokseumawe (PNL). Dibangun menggunakan arsitektur modern (Laravel 11, React, Inertia.js, Tailwind CSS) dengan fitur integrasi Peta, QR Code, dan Progressive Web App (PWA).

## 🌟 Fitur Utama
1. **Pelaporan Kehilangan & Temuan (Lost & Found)**: Mahasiswa dapat mengunggah foto, deskripsi, dan titik koordinat (Leaflet.js) barang.
2. **Sistem Verifikasi Multi-Tahap (Klaim)**: Barang tidak bisa diklaim sembarangan. Pengklaim wajib menyertakan bukti (seperti STNK, KTM, atau ciri khusus), dan laporan disetujui melalui Panel Admin.
3. **In-App Messaging (Chat Internal)**: Diskusi anonim/privat antara pihak penemu dan pencari di dalam aplikasi (tanpa bertukar nomor HP sebelum diverifikasi).
4. **Validasi Serah Terima QR Code**: Setiap barang yang diserahkan ke pos satpam akan dilabeli QR Code. Saat pemilik sah datang, Admin men-scan QR tersebut untuk menutup laporan secara otomatis.
5. **Dashboard Analitik (Chart.js) & Cetak PDF**: Visualisasi data statistik distribusi barang hilang/ditemukan dan fitur cetak laporan formal untuk administrasi kampus.
6. **Sistem Gamifikasi (Poin & Leaderboard)**: Memberikan +10 Poin Kejujuran bagi mahasiswa yang menemukan dan melaporkan barang. Daftar "Pahlawan Kejujuran" akan tampil di halaman utama.
7. **Progressive Web App (PWA)**: Dapat di-*install* langsung di layar utama (home screen) smartphone tanpa perlu melalui Play Store/App Store.

## 🛠️ Stack Teknologi
- **Backend**: Laravel 11.x, MySQL
- **Frontend**: React 18.x, Inertia.js, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Ekstensi**: Leaflet (Maps), Chart.js (Grafik), qrcode.react (QR), vite-plugin-pwa

## 🚀 Cara Menjalankan Proyek (Local Development)

### 1. Prasyarat
Pastikan laptop/PC Anda sudah terpasang:
- PHP >= 8.2 (Bawaan XAMPP versi terbaru)
- Composer
- Node.js (v18+) & NPM
- MySQL / XAMPP

### 2. Instalasi & Setup Database
1. Buka Terminal/Command Prompt di folder proyek ini.
2. Salin file `.env.example` menjadi `.env`.
3. Buka file `.env`, ubah bagian `DB_DATABASE` menjadi `lostfound_pnl` (atau sesuai nama database yang Anda buat di phpMyAdmin).
4. Jalankan perintah instalasi berikut secara berurutan:
```bash
composer install
npm install
php artisan key:generate
```

### 3. Migrasi & Data Otomatis (Dummy Data)
Untuk menghasilkan database lengkap beserta akun admin dan data uji coba, jalankan:
```bash
php artisan migrate:fresh --seed
```

### 4. Menjalankan Server
Anda membutuhkan **dua tab terminal** untuk menjalankan aplikasi (atau klik `start-server.bat` jika ada).
- **Terminal 1 (Backend PHP):** `php artisan serve`
- **Terminal 2 (Frontend React):** `npm run dev`

Buka browser dan akses: `http://localhost:8000`

## 🔑 Akun Uji Coba
Aplikasi dilengkapi dengan beberapa akun (password semua akun adalah: `password`).
- **Akun Admin (Satpam):**
  - Email: `admin@pnl.ac.id`
- **Akun Mahasiswa (Leaderboard):**
  - Email: `budi@pnl.ac.id`
  - Email: `siti@pnl.ac.id`
  - Email: `ahmad@pnl.ac.id`

---
*Proyek ini dikembangkan sebagai prototipe Sistem Informasi Lost and Found kampus yang modern, interaktif, dan berorientasi pada penyelesaian masalah administrasi manual.*
