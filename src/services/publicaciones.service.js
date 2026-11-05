const pool = require('../config/db');

// Consulta base: una publicacion con el nombre/avatar de su autor
// y la cantidad de comentarios que tiene.
const SELECT_PUBLICACION = `
  SELECT p.id, p.titulo, p.comunidad,
         u.nombre AS usuario, u.avatar,
         p.contenido, p.votos,
         p.created_at AS "creadaEn",
         (SELECT count(*) FROM comentarios c WHERE c.publicacion_id = p.id)::int
           AS "cantidadComentarios"
  FROM publicaciones p
  JOIN usuarios u ON u.id = p.usuario_id`;

exports.listar = async (cantidad, from) => {
  const { rows } = await pool.query(
    `${SELECT_PUBLICACION}
     ORDER BY p.created_at DESC, p.id DESC
     LIMIT $1 OFFSET $2`,
    [cantidad, from]
  );
  return rows;
};

exports.contar = async () => {
  const { rows } = await pool.query('SELECT count(*)::int AS total FROM publicaciones');
  return rows[0].total;
};

// Devuelve la publicacion con sus comentarios, o undefined si no existe.
exports.obtener = async (id) => {
  const { rows } = await pool.query(`${SELECT_PUBLICACION} WHERE p.id = $1`, [id]);
  if (rows.length === 0) return undefined;

  const comentarios = await pool.query(
    `SELECT c.id, u.nombre AS usuario, u.avatar, c.contenido, c.votos,
            c.created_at AS "creadaEn"
     FROM comentarios c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.publicacion_id = $1
     ORDER BY c.created_at DESC, c.id DESC`,
    [id]
  );

  return { ...rows[0], comentarios: comentarios.rows };
};

// Devuelve la publicacion creada, o null si el usuario indicado no existe.
exports.crear = async ({ titulo, comunidad, contenido, usuario }) => {
  const autor = await pool.query('SELECT id FROM usuarios WHERE nombre = $1', [usuario]);
  if (autor.rows.length === 0) return null;

  const { rows } = await pool.query(
    `INSERT INTO publicaciones (titulo, comunidad, usuario_id, contenido)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [titulo, comunidad, autor.rows[0].id, contenido]
  );

  return exports.obtener(rows[0].id);
};

// Devuelve la publicacion actualizada, o undefined si no existe.
exports.actualizar = async (id, { titulo, comunidad, contenido }) => {
  const { rows } = await pool.query(
    `UPDATE publicaciones
     SET titulo = $1, comunidad = $2, contenido = $3
     WHERE id = $4
     RETURNING id`,
    [titulo, comunidad, contenido, id]
  );
  if (rows.length === 0) return undefined;

  return exports.obtener(id);
};
