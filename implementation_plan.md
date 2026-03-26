# Action Plan: Advanced BE Mission

Ini adalah rencana kerja (Action Plan) yang disederhanakan agar mudah dipahami langkah demi langkah.

## ⚠️ PENTING: Teguran "Masukan harus berupa item pada daftar yang ditentukan"
Jika guru menguji API (aplikasi) milik Leo dan memberikan teguran tersebut, ini artinya guru Anda sedang menguji **Validasi Input API (Whitelist Validation)**.

Dalam pembuatan backend kelas *Advanced*, kita **tidak boleh percaya 100% pada apa yang diinputkan user**. Guru Anda kemungkinan mencoba "meretas" atau mencari kelemahan dengan memasukkan parameter yang tidak wajar di URL, misalnya `GET /movie?sortBy=kolom_ngawur` atau memasukkan gender/role yang tidak ada di daftar.

Kelemahan teman Anda adalah: kodenya langsung mengeksekusi input aneh itu ke database tanpa penyaringan, sehingga aplikasi berpotensi *crash* atau *error*.

**Solusi yang akan kita terapkan:**
Di setiap fitur (terutama Filter dan Sort), kita akan **membuat Daftar Putih (Whitelist)**. 
Sebagai contoh, parameter `sortBy` **HANYA BOLEH** diisi `id`, `title`, `year`, atau `rating`. Jika user mengirim teks lain di luar daftar itu, aplikasi tidak akan jebol, melainkan secara elegan akan menolak dan memunculkan *error message* HTTP 400 yang rapi.

---

## Tahapan Pengerjaan Coding (Langkah demi Langkah)

### Fase 1: Persiapan Akun & Database (Langkah 1 & 2)
Fase ini fokus untuk membuat agar aplikasi memiliki fitur pendaftaran user.
1. **Buat Tabel User:** Tambahkan tabel `users` di database yang isinya: ID, Fullname, Username, Password, Email, dan Verification_Token (dikosongkan dulu).
2. **Setup Register (`POST /register`):** 
   - User memasukkan data diri.
   - Gunakan `bcrypt.hash()` untuk "mengacak" password agar tidak terbaca di database (ini wajib untuk keamanan).
   - Simpan data ke tabel `users`.

### Fase 2: Sistem Kunci & Tiket Masuk (Langkah 3 & 4)
Fase ini fokus pada Login dan pengamanan.
1. **Setup Login (`POST /login`):** 
   - Cek apakah email ada di database. 
   - Jika ada, gunakan `bcrypt.compare()` untuk mencocokkan password.
   - Jika cocok, buatkan "Tiket Masuk" menggunakan `jsonwebtoken` (JWT) dan kirim ke user.
2. **Setup Satpam (Middleware):** 
   - Buat sebuah sistem `authMiddleware` yang bertugas sebagai satpam.
   - Cara kerjanya: Setiap ada yang akses `GET /movie`, pastikan dia membawa token JWT yang valid. Jika tidak valid, tolak!

### Fase 3: Pencarian Canggih (Langkah 5)
Fase ini membuat list film bisa dicari dan diurutkan.
1. **Modifikasi Endpoint `GET /movie`:**
   Tangkap parameter dari URL (misalnya: `?genre=action&sortBy=tahun&search=avenger`).
2. **Logika Database:**
   - **Filter:** Gunakan query `WHERE genre = 'action'`
   - **Sort:** Gunakan query `ORDER BY tahun DESC`
   - **Search:** Gunakan query `WHERE judul_film LIKE '%avenger%'`

### Fase 4: Verifikasi & Upload (Langkah 6 & 7)
Fase terakhir menambahkan fitur profesional.
1. **Verifikasi Email (`GET /verify-email`):**
   - Saat `register`, buat kode unik panjang dengan `uuid`. Simpan di database dan kirim kode itu ke email pendaftar lewat `nodemailer`.
   - Buat endpoint `/verify-email` untuk mengecek: apakah kode UUID yang diberikan sama dengan yang di database? Jika ya, akun berhasil dikonfirmasi.
2. **Upload Gambar (`POST /upload`):**
   - Buat folder bernama `upload` di proyek Anda.
   - Gunakan `multer` untuk menerima file gambar dan menyimpannya otomatis ke folder tersebut.

---

> _Ikuti Checklist pada file `task.md` secara berurutan. Jika sudah siap, kita bisa mulai mengerjakan **Fase 1**._
