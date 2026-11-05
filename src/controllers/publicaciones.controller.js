const service = require('../services/publicaciones.service');

exports.listar = async (req, res) => {
  const { cantidad, from } = res.locals.paginacion;

  const [items, total] = await Promise.all([
    service.listar(cantidad, from),
    service.contar()
  ]);

  res.json({ items, total, hayMas: from + items.length < total });
};

exports.obtener = async (req, res) => {
  const publicacion = await service.obtener(res.locals.id);

  if (!publicacion) {
    return res.status(404).json({ error: 'Publicación no encontrada' });
  }
  res.json(publicacion);
};

exports.crear = async (req, res) => {
  const publicacion = await service.crear(res.locals.datos);

  if (!publicacion) {
    return res.status(400).json({
      error: `El usuario "${res.locals.datos.usuario}" no existe`
    });
  }

  res
    .status(201)
    .location(`/api/publicaciones/${publicacion.id}`)
    .json(publicacion);
};

exports.actualizar = async (req, res) => {
  const publicacion = await service.actualizar(res.locals.id, res.locals.datos);

  if (!publicacion) {
    return res.status(404).json({ error: 'Publicación no encontrada' });
  }
  res.json(publicacion);
};
