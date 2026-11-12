// Los 4 endpoints de /api/publicaciones, con sus consultas SQL.
const router = require('express').Router();
const db = require('./db');
const { leerPaginacion, leerId, leerPublicacion } = require('./validaciones');

// Responde 400 con el mensaje (y los detalles, si los hay) que devolvio la validacion.
const rechazar = (res, validacion) =>
  res.status(400).json({ error: validacion.error, detalles: validacion.detalles });

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

// Busca una publicacion por id y le agrega sus comentarios.
// Devuelve undefined si no existe. La usan GET /:id, POST y PUT.
async function buscarPublicacion(id) {
  const { rows } = await db.query(`${SELECT_PUBLICACION} WHERE p.id = $1`, [id]);
  if (rows.length === 0) return undefined;

  const comentarios = await db.query(
    `SELECT c.id, u.nombre AS usuario, u.avatar, c.contenido, c.votos,
            c.created_at AS "creadaEn"
     FROM comentarios c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.publicacion_id = $1
     ORDER BY c.created_at DESC, c.id DESC`,
    [id]
  );

  return { ...rows[0], comentarios: comentarios.rows };
}

// GET /api/publicaciones?cantidad=5&from=0&usuario=Dev
router.get('/', async (req, res) => {
  const p = leerPaginacion(req.query);
  if (p.error) return rechazar(res, p);

  const lista = await db.query(
    `${SELECT_PUBLICACION}
     WHERE ($3::text IS NULL OR u.nombre = $3)
     ORDER BY p.created_at DESC, p.id DESC
     LIMIT $1 OFFSET $2`,
    [p.cantidad, p.from, p.usuario]
  );
  const conteo = await db.query(
    `SELECT count(*)::int AS total
     FROM publicaciones p
     JOIN usuarios u ON u.id = p.usuario_id
     WHERE ($1::text IS NULL OR u.nombre = $1)`,
    [p.usuario]
  );

  const total = conteo.rows[0].total;
  res.json({ items: lista.rows, total, hayMas: p.from + lista.rows.length < total });
});

// GET /api/publicaciones/:id
router.get('/:id', async (req, res) => {
  const v = leerId(req.params.id);
  if (v.error) return rechazar(res, v);

  const publicacion = await buscarPublicacion(v.id);
  if (!publicacion) return res.status(404).json({ error: 'Publicación no encontrada' });

  res.json(publicacion);
});

// POST /api/publicaciones
router.post('/', async (req, res) => {
  const d = leerPublicacion(req.body, { exigeUsuario: true });
  if (d.error) return rechazar(res, d);

  const autor = await db.query('SELECT id FROM usuarios WHERE nombre = $1', [d.usuario]);
  if (autor.rows.length === 0) {
    return res.status(400).json({ error: `El usuario "${d.usuario}" no existe` });
  }

  const { rows } = await db.query(
    `INSERT INTO publicaciones (titulo, comunidad, usuario_id, contenido)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [d.titulo, d.comunidad, autor.rows[0].id, d.contenido]
  );

  const id = rows[0].id;
  res.status(201).location(`/api/publicaciones/${id}`).json(await buscarPublicacion(id));
});

// PUT /api/publicaciones/:id   (edita titulo, comunidad y contenido; el autor no cambia)
router.put('/:id', async (req, res) => {
  const v = leerId(req.params.id);
  if (v.error) return rechazar(res, v);

  const d = leerPublicacion(req.body, { exigeUsuario: false });
  if (d.error) return rechazar(res, d);

  const { rows } = await db.query(
    `UPDATE publicaciones
     SET titulo = $1, comunidad = $2, contenido = $3
     WHERE id = $4
     RETURNING id`,
    [d.titulo, d.comunidad, d.contenido, v.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Publicación no encontrada' });

  res.json(await buscarPublicacion(v.id));
});

module.exports = router;
