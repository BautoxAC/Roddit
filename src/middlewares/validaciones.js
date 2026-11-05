const CANTIDAD_POR_DEFECTO = 10;
const CANTIDAD_MAXIMA = 50;

const textoValido = (valor, maximo) =>
  typeof valor === 'string' && valor.trim() !== '' && valor.trim().length <= maximo;

// Valida ?cantidad=...&from=... y deja los numeros en res.locals.paginacion
exports.validarPaginacion = (req, res, next) => {
  const cantidad = req.query.cantidad === undefined
    ? CANTIDAD_POR_DEFECTO
    : Number(req.query.cantidad);
  const from = req.query.from === undefined ? 0 : Number(req.query.from);

  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAXIMA) {
    return res.status(400).json({
      error: `"cantidad" debe ser un entero entre 1 y ${CANTIDAD_MAXIMA}`
    });
  }
  if (!Number.isInteger(from) || from < 0) {
    return res.status(400).json({ error: '"from" debe ser un entero mayor o igual a 0' });
  }

  res.locals.paginacion = { cantidad, from };
  next();
};

// Valida :id y lo deja como numero en res.locals.id
exports.validarId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }

  res.locals.id = id;
  next();
};

// Genera el middleware que valida el body de una publicacion.
// Al crear se exige "usuario"; al editar no (el autor no se cambia).
function validarBody({ exigeUsuario }) {
  return (req, res, next) => {
    // En Express 5, req.body es undefined si no llego un JSON.
    const body = req.body ?? {};

    if (typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'El cuerpo debe ser un objeto JSON' });
    }

    const detalles = [];
    if (!textoValido(body.titulo, 200))
      detalles.push('"titulo" es obligatorio, debe ser string y tener hasta 200 caracteres');
    if (!textoValido(body.comunidad, 50))
      detalles.push('"comunidad" es obligatoria, debe ser string y tener hasta 50 caracteres');
    if (!textoValido(body.contenido, 10000))
      detalles.push('"contenido" es obligatorio, debe ser string y tener hasta 10000 caracteres');
    if (exigeUsuario && !textoValido(body.usuario, 50))
      detalles.push('"usuario" es obligatorio, debe ser string y tener hasta 50 caracteres');

    if (detalles.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos', detalles });
    }

    // Guardamos solo los campos permitidos, ya limpios de espacios.
    res.locals.datos = {
      titulo: body.titulo.trim(),
      comunidad: body.comunidad.trim(),
      contenido: body.contenido.trim(),
      usuario: exigeUsuario ? body.usuario.trim() : undefined
    };
    next();
  };
}

exports.validarCrearPublicacion = validarBody({ exigeUsuario: true });
exports.validarEditarPublicacion = validarBody({ exigeUsuario: false });
