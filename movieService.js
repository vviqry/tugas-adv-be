const db = require('./config');

// SELECT semua data film + filter, sort, search
const getAllMovies = async ({ genre, sortBy, order, search } = {}) => {
  let query = 'SELECT * FROM SeriesFilm WHERE 1=1';
  const params = [];

  // FILTER berdasarkan genre
  if (genre) {
    query += ' AND genre = ?';
    params.push(genre);
  }

  // SEARCH berdasarkan judul (LIKE)
  if (search) {
    query += ' AND judul LIKE ?';
    params.push(`%${search}%`);
  }

  // SORT berdasarkan kolom dan urutan
  if (sortBy) {
    const safeOrder = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortBy} ${safeOrder}`;
  }

  const [rows] = await db.query(query, params);
  return rows;
};

const getMovieById = async (id) => {
  const [rows] = await db.query('SELECT * FROM SeriesFilm WHERE id = ?', [id]);
  return rows[0];
};

const addMovie = async (data) => {
  const { judul, deskripsi, tahun_rilis } = data;
  const [result] = await db.query(
    'INSERT INTO SeriesFilm (judul, deskripsi, tahun_rilis) VALUES (?, ?, ?)',
    [judul, deskripsi, tahun_rilis]
  );
  return getMovieById(result.insertId);
};

const updateMovie = async (id, data) => {
  const allowedFields = ['judul', 'deskripsi', 'tahun_rilis'];
  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return { affectedRows: 0, noFields: true };

  values.push(id);
  const [result] = await db.query(
    `UPDATE SeriesFilm SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result;
};

const deleteMovie = async (id) => {
  const [result] = await db.query('DELETE FROM SeriesFilm WHERE id = ?', [id]);
  return result;
};

module.exports = { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie };
