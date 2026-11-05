const contenedorHeader = document.querySelector("#header-contenedor");
const contenedorFooter = document.querySelector("#footer-contenedor");
const paginaActual = document.body.dataset.pagina;
const botonCargarMas = document.querySelector("#boton-cargar-mas");

// Insertamos el header
contenedorHeader.innerHTML = crearHeader(paginaActual);

// Insertamos el footer
contenedorFooter.innerHTML = crearFooter();

// Insertamos las publicaciones

if (botonCargarMas) {
    botonCargarMas.addEventListener("click", cargarMasPublicaciones);
}

cargarMasPublicaciones();

renderizarDetallePublicacion();