const express = require('express');
const path = require('path');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// TEMPORAL: solo para comprobar la conexion a Postgres (se borra despues)
app.get('/api/health', async (req, res) => {
  const { rows } = await pool.query('SELECT count(*)::int AS publicaciones FROM publicaciones');
  res.json(rows[0]);
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));