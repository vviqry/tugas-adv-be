# Advanced BE Mission Task List

- [x] **1. Persiapan Database (User Table)**
  - [x] Mendesain ERD untuk tabel `User`.
  - [x] Membuat tabel `users` di database MySQL dengan kolom: `fullname`, `username`, `password`, `email`, dan `verification_token`.

- [x] **2. Fitur Registrasi & Login (Autentikasi)**
  - [x] Menginstal `bcrypt` untuk enkripsi password.
  - [x] Membuat endpoint `POST /register` untuk menyimpan data user baru.
  - [x] Menginstal `jsonwebtoken` (JWT).
  - [x] Membuat endpoint `POST /login` untuk cek email & password, lalu memberikan token JWT.

- [x] **3. Proteksi Endpoint (Middleware)**
  - [x] Membuat fungsi `authMiddleware` untuk mengecek validitas JWT.
  - [x] Menerapkan middleware pada endpoint `GET /movie` agar hanya user yang login yang bisa akses.

- [x] **4. Fitur Filter, Sort, & Search (Query Params)**
  - [x] Memodifikasi endpoint `GET /movie` untuk membaca `req.query`.
  - [x] **(KRUSIAL)** Membuat Validasi Daftar Putih (Whitelist) untuk `genre` dan `sortBy` agar hanya menerima input yang diizinkan (sesuai teguran guru).
  - [x] Menambahkan logika `WHERE genre = ?` (Filter).
  - [x] Menambahkan logika `ORDER BY ?` (Sort).
  - [x] Menambahkan logika `WHERE judul LIKE %?%` (Search).

- [x] **5. Fitur Verifikasi Email**
  - [x] Menginstal `nodemailer` dan `uuid`.
  - [x] Memodifikasi `POST /register` agar otomatis mengirim email berisi token konfirmasi.
  - [x] Membuat endpoint `GET /verify-email` untuk mengecek dan mengaktifkan akun.

- [x] **6. Fitur Upload Gambar**
  - [x] Menginstal `multer` dan membuat folder `upload/` di proyek.
  - [x] Membuat endpoint `POST /upload` agar menerima file dan menyimpannya ke folder tujuan.
