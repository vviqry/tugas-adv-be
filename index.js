const express = require('express');
const app = express();
const movieService = require('./movieService');
const userService = require('./userService');
const authMiddleware = require('./authMiddleware');
const multer = require('multer');

app.use(express.json());

// ─────────────────────────────────────────────────────────────
// KONFIGURASI MULTER (upload gambar ke folder upload/)
// ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'upload/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ─────────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────────────────────

// POST /register
app.post('/register', async (req, res) => {
  try {
    const { fullname, username, password, email } = req.body;
    if (!fullname || !username || !password || !email) {
      return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi' });
    }
    const newUser = await userService.register({ fullname, username, password, email });
    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi akun.',
      data: newUser,
    });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', message: error.message });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi' });
    }
    const result = await userService.login({ email, password });
    res.status(200).json({ status: 'success', message: 'Login berhasil', data: result });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', message: error.message });
  }
});

// GET /verify-email?token=xxx
app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ status: 'error', message: 'Token tidak ditemukan' });
    }
    await userService.verifyEmail(token);
    res.status(200).json({ status: 'success', message: 'Email Verified Successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// MOVIE ENDPOINTS (protected by JWT, with filter/sort/search)
// ─────────────────────────────────────────────────────────────

// Daftar Putih — mencegah input ngawur dari user
const ALLOWED_GENRES  = ['action', 'drama', 'comedy', 'horror', 'romance', 'sci-fi', 'thriller'];
const ALLOWED_SORT_BY = ['id', 'judul', 'tahun_rilis'];
const ALLOWED_ORDER   = ['asc', 'desc'];

// GET /movies?genre=action&sortBy=judul&order=asc&search=avenger
app.get('/movies', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { genre, sortBy, order, search } = req.query;

    if (genre && !ALLOWED_GENRES.includes(genre.toLowerCase())) {
      return res.status(400).json({
        status: 'error',
        message: `Masukan harus berupa item pada daftar yang ditentukan. Genre valid: ${ALLOWED_GENRES.join(', ')}`,
      });
    }
    if (sortBy && !ALLOWED_SORT_BY.includes(sortBy.toLowerCase())) {
      return res.status(400).json({
        status: 'error',
        message: `Masukan harus berupa item pada daftar yang ditentukan. sortBy valid: ${ALLOWED_SORT_BY.join(', ')}`,
      });
    }
    if (order && !ALLOWED_ORDER.includes(order.toLowerCase())) {
      return res.status(400).json({
        status: 'error',
        message: `Masukan harus berupa item pada daftar yang ditentukan. order valid: asc, desc`,
      });
    }

    const movies = await movieService.getAllMovies({ genre, sortBy, order, search });
    res.status(200).json({ status: 'success', message: 'Data film berhasil diambil', data: movies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data film' });
  }
});

// GET /movie/:id
app.get('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ status: 'error', message: 'Film tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Data film berhasil diambil', data: movie });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data film' });
  }
});

// POST /movie
app.post('/movie', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { judul, deskripsi, tahun_rilis } = req.body;
    if (!judul || !deskripsi || tahun_rilis === undefined) {
      return res.status(400).json({ status: 'error', message: 'Field judul, deskripsi, tahun_rilis wajib diisi' });
    }
    const newMovie = await movieService.addMovie({ judul, deskripsi, tahun_rilis });
    res.status(201).json({ status: 'success', message: 'Film berhasil ditambahkan', data: newMovie });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan film' });
  }
});

// PATCH /movie/:id
app.patch('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ status: 'error', message: 'Film tidak ditemukan' });

    const result = await movieService.updateMovie(req.params.id, req.body);
    if (result.noFields) {
      return res.status(400).json({ status: 'error', message: 'Minimal satu field harus dikirim' });
    }

    const updated = await movieService.getMovieById(req.params.id);
    res.status(200).json({ status: 'success', message: 'Film berhasil diperbarui', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui film' });
  }
});

// DELETE /movie/:id
app.delete('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
  try {
    const result = await movieService.deleteMovie(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Film tidak ditemukan' });
    res.status(200).json({ status: 'success', message: 'Film berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus film' });
  }
});

// ─────────────────────────────────────────────────────────────
// UPLOAD ENDPOINT
// ─────────────────────────────────────────────────────────────

// POST /upload
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'error', message: 'Tidak ada file yang dikirim' });
    res.status(200).json({
      status: 'success',
      message: 'File berhasil diupload',
      data: { filename: req.file.filename, path: req.file.path, size: req.file.size },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengupload file' });
  }
});

// ─────────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
