
const CANTIDAD_POR_DEFECTO = 10;
const CANTIDAD_MAXIMA = 50;

const textoValido = (valor, maximo) =>
  typeof valor === 'string' && valor.trim() !== '' && valor.trim().length <= maximo;

// ?cantidad=10&from=0&usuario=Dev   (los tres son opcionales)
function leerPaginacion(query) {
  const cantidad = query.cantidad === undefined ? CANTIDAD_POR_DEFECTO : Number(query.cantidad);
  const from = query.from === undefined ? 0 : Number(query.from);

  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAXIMA) {
    return { error: `"cantidad" debe ser un entero entre 1 y ${CANTIDAD_MAXIMA}` };
  }
  if (!Number.isInteger(from) || from < 0) {
    return { error: '"from" debe ser un entero mayor o igual a 0' };
  }
  if (query.usuario !== undefined && !textoValido(query.usuario, 50)) {
    return { error: '"usuario" debe ser un texto de hasta 50 caracteres' };
  }

  return { cantidad, from, usuario: query.usuario?.trim() ?? null };
}

// /api/publicaciones/:id
function leerId(valor) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id < 1) {
    return { error: 'El id debe ser un número entero positivo' };
  }
  return { id };
}

function leerPublicacion(body, { exigeUsuario }) {
  body = body ?? {};

  if (typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'El cuerpo debe ser un objeto JSON' };
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
    return { error: 'Datos inválidos', detalles };
  }

  return {
    titulo: body.titulo.trim(),
    comunidad: body.comunidad.trim(),
    contenido: body.contenido.trim(),
    usuario: exigeUsuario ? body.usuario.trim() : undefined
  };
}

module.exports = { leerPaginacion, leerId, leerPublicacion };
