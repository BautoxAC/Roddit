// Cualquier ruta /api/... que no exista responde 404 en JSON (no en HTML).
exports.apiNoEncontrada = (req, res) => {
  res.status(404).json({ error: `No existe el endpoint ${req.method} ${req.originalUrl}` });
};

// Manejo central de errores inesperados.
exports.errores = (err, req, res, next) => {
  // express.json() lanza este error cuando el body no es un JSON valido.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
