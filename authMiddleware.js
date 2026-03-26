const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Ambil token dari header: Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Autentikasi gagal: Token tidak ditemukan',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user di request
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Autentikasi gagal: Token tidak valid atau sudah kadaluarsa',
    });
  }
};

module.exports = { verifyToken };
