const contenedorHeader = document.querySelector("#header-contenedor");

const contenedorFooter = document.querySelector("#footer-contenedor");

const paginaActual = document.body.dataset.pagina;

// Insertamos el header
contenedorHeader.innerHTML = crearHeader(paginaActual);

// Insertamos el footer
contenedorFooter.innerHTML = crearFooter();