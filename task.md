# Advanced BE Mission Task List

- [ ] **1. Persiapan Database (User Table)**
  - [ ] Mendesain ERD untuk tabel `User`.
  - [ ] Membuat tabel `users` di database MySQL dengan kolom: `fullname`, `username`, `password`, `email`, dan `verification_token`.

- [ ] **2. Fitur Registrasi & Login (Autentikasi)**
  - [ ] Menginstal `bcrypt` untuk enkripsi password.
  - [ ] Membuat endpoint `POST /register` untuk menyimpan data user baru.
  - [ ] Menginstal `jsonwebtoken` (JWT).
  - [ ] Membuat endpoint `POST /login` untuk cek email & password, lalu memberikan token JWT.

- [ ] **3. Proteksi Endpoint (Middleware)**
  - [ ] Membuat fungsi `authMiddleware` untuk mengecek validitas JWT.
  - [ ] Menerapkan middleware pada endpoint `GET /movie` agar hanya user yang login yang bisa akses.

- [ ] **4. Fitur Filter, Sort, & Search (Query Params)**
  - [ ] Memodifikasi endpoint `GET /movie` untuk membaca `req.query`.
  - [ ] **(KRUSIAL)** Membuat Validasi Daftar Putih (Whitelist) untuk `genre` dan `sortBy` agar hanya menerima input yang diizinkan (sesuai teguran guru).
  - [ ] Menambahkan logika `WHERE genre = ?` (Filter).
  - [ ] Menambahkan logika `ORDER BY ?` (Sort).
  - [ ] Menambahkan logika `WHERE judul LIKE %?%` (Search).

- [ ] **5. Fitur Verifikasi Email**
  - [ ] Menginstal `nodemailer` dan `uuid`.
  - [ ] Memodifikasi `POST /register` agar otomatis mengirim email berisi token konfirmasi.
  - [ ] Membuat endpoint `GET /verify-email` untuk mengecek dan mengaktifkan akun.

- [ ] **6. Fitur Upload Gambar**
  - [ ] Menginstal `multer` dan membuat folder `upload/` di proyek.
  - [ ] Membuat endpoint `POST /upload` agar menerima file dan menyimpannya ke folder tujuan.
