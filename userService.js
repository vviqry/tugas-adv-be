const db = require('./config');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const SALT_ROUNDS = 10;

// ─── REGISTER ──────────────────────────────────────────────────────────────────
const register = async ({ fullname, username, password, email }) => {
  // 1. Cek apakah email sudah terdaftar
  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    const err = new Error('Email sudah terdaftar');
    err.status = 409;
    throw err;
  }

  // 2. Enkripsi password pakai bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Generate token unik untuk verifikasi email
  const verificationToken = uuidv4();

  // 4. Simpan user ke database
  const [result] = await db.query(
    'INSERT INTO users (fullname, username, password, email, verification_token) VALUES (?, ?, ?, ?, ?)',
    [fullname, username, hashedPassword, email, verificationToken]
  );

  // 5. Kirim email verifikasi
  await sendVerificationEmail(email, fullname, verificationToken);

  return { id: result.insertId, fullname, username, email };
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  // 1. Cari user berdasarkan email
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    const err = new Error('Email atau password salah');
    err.status = 401;
    throw err;
  }

  const user = rows[0];

  // 2. Bandingkan password dengan yang tersimpan (bcrypt.compare)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Email atau password salah');
    err.status = 401;
    throw err;
  }

  // 3. Buat JWT token
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: { id: user.id, fullname: user.fullname, username: user.username, email: user.email },
  };
};

// ─── VERIFIKASI EMAIL ──────────────────────────────────────────────────────────
const verifyEmail = async (token) => {
  const [rows] = await db.query('SELECT * FROM users WHERE verification_token = ?', [token]);
  if (rows.length === 0) {
    const err = new Error('Invalid Verification Token');
    err.status = 400;
    throw err;
  }

  await db.query(
    'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?',
    [token]
  );

  return true;
};

// ─── KIRIM EMAIL ───────────────────────────────────────────────────────────────
const sendVerificationEmail = async (email, fullname, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // gunakan false untuk TLS (port 587)
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Movie App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifikasi Email Kamu - Movie App',
    html: `
      <h2>Halo, ${fullname}!</h2>
      <p>Terima kasih sudah mendaftar. Klik tombol di bawah untuk verifikasi email kamu:</p>
      <a href="${verifyUrl}" style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
        Verifikasi Email
      </a>
      <p>Atau copy link ini:<br/>${verifyUrl}</p>
    `,
  });
};

module.exports = { register, login, verifyEmail };
