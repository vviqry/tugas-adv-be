# 🎬 Movie App REST API (Advanced BE)

Sebuah REST API sederhana namun kuat (robust) yang dibangun menggunakan Node.js dan Express.js untuk mengelola daftar film (SeriesFilm) dan pengguna (Users). Proyek ini merupakan pemenuhan misi "Advanced Backend" dengan fokus utama pada **Keamanan**, **Autentikasi**, dan **Validasi Input**.

## ✨ Fitur Utama
1. **Autentikasi Aman:** 
   - Registrasi user baru dengan penyandian password rahasia menggunakan `bcrypt`.
   - Login user untuk mendapatkan akses masuk berupa **Token JWT (JSON Web Token)**.
   - Endpoint terlindungi (*Protected Routes*) menggunakan Middleware Satpam.
2. **Email Otomatis (Nodemailer):**
   - Mengirimkan email verifikasi pintar berisi token unik (`uuid`) kepada user yang baru mendaftar.
3. **Penyaringan Pintar (Filter, Sort, Search):**
   - Mendukung pencarian film berdasarkan judul (`search`), pengurutan rilis/abjad (`sortBy`, `order`), dan penyaringan kategori (`genre`).
   - 🛡️ **Dilengkapi Whitelist Validation:** Menolak input kriteria pencarian yang tidak masuk akal (Teguran-Proof).
4. **Upload File (Multer):**
   - Mampu menerima file gambar dari luar dan menyimpannya secara rapi di dalam server lokal (`/upload`).

## 🛠️ Tech Stack
- **Node.js** & **Express.js** (Framework)
- **MySQL2** (Database Driver)
- **Bcrypt** & **JWT** (Security)
- **Nodemailer** (Mailing System)
- **Multer** (File Handler)

## 🚀 Cara Instalasi
1. *Clone* repository ini ke laptop Anda.
2. Buka terminal di dalam folder ini dan jalankan:
   ```bash
   npm install
   ```
3. Buat database bernama `movie_db` di phpMyAdmin/MySQL Anda.
4. Eksekusi kode SQL yang ada di file `create_users_table.sql` untuk membuat struktur tabel.
5. Buat file `.env` di folder utama dan isi dengan konfigurasi berikut:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=movie_db
   DB_PORT=3306

   JWT_SECRET=bebas_isi_rahasia_anda
   EMAIL_USER=email_gmail_anda@gmail.com
   EMAIL_PASS=password_aplikasi_google_16_digit
   ```
6. Jalankan server:
   ```bash
   npm start
   ```
   *(Server akan berjalan di http://localhost:3000)*

## 📚 Endpoint API
Baca tabel dokumentasi endpoint lengkap pada tugas Anda atau lihat file internal projek jika tersedia. Semua akses ke endpoint `/movies` mewajibkan penggunaan **Bearer Token** di kolom *Authorization* Header.
