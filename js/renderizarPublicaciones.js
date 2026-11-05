const TAMANIO_PAGINA = 5;

let numeroPaginaActual = 0;
let cargandoPublicaciones = false;


function crearPublicacion(publicacion) {

    const cantidadComentarios = publicacion.comentarios.length;

    return `
        <article class="post">

            <header class="post-header">

                <div class="publicacion-usuario">

                    <a class="avatar-link"
                       href="perfil.html"
                       aria-label="Ver perfil de ${publicacion.usuario}">

                        <span class="avatar av-1" aria-hidden="true">
                            ${publicacion.avatar}
                        </span>

                    </a>

                    <p class="comunidad-info post-data">

                        Publicado en
                        <strong>c/${publicacion.comunidad}</strong>

                        por
                        <a href="perfil.html">@${publicacion.usuario}</a>

                        •
                        <time>${publicacion.fecha}</time>

                    </p>

                </div>

                <h2 class="post-titulo">

                    <a href="publicacion.html?id=${publicacion.id}">
                        ${publicacion.titulo}
                    </a>

                </h2>

            </header>


            <aside class="post-votos" aria-label="Votación">

                <button type="button" aria-label="Votar a favor">
                    ▲
                </button>

                <span>${publicacion.votos}</span>

                <button type="button" aria-label="Votar en contra">
                    ▼
                </button>

            </aside>


            <section class="post-contenido">

                <p>${publicacion.contenido}</p>

            </section>


            <footer class="post-footer">

                <a href="publicacion.html?id=${publicacion.id}"
                   class="boton-comentarios">

                    Ver ${cantidadComentarios}
                    ${cantidadComentarios === 1 ? "comentario" : "comentarios"}

                </a>

                <button type="button">
                    Compartir
                </button>

                <button type="button">
                    Guardar
                </button>

            </footer>

        </article>
    `;
}



function crearComentario(comentario, comunidad) {

    return `
        <article class="post">

            <header class="post-header">

                <div class="publicacion-usuario">

                    <a class="avatar-link"
                       href="perfil.html"
                       aria-label="Ver perfil de ${comentario.usuario}">

                        <span class="avatar av-1" aria-hidden="true">
                            ${comentario.avatar}
                        </span>

                    </a>

                    <p class="comunidad-info post-data">

                        Comentario en
                        <strong>c/${comunidad}</strong>

                        por
                        <a href="perfil.html">@${comentario.usuario}</a>

                        •
                        <time>${comentario.fecha}</time>

                    </p>

                </div>

            </header>


            <aside class="post-votos" aria-label="Votación">

                <button type="button" aria-label="Votar a favor">
                    ▲
                </button>

                <span>${comentario.votos}</span>

                <button type="button" aria-label="Votar en contra">
                    ▼
                </button>

            </aside>


            <section class="post-contenido">

                <p>${comentario.contenido}</p>

            </section>


            <footer class="post-footer">

                <button type="button">
                    Responder
                </button>

                <button type="button">
                    Compartir
                </button>

                <button type="button">
                    Guardar
                </button>

            </footer>

        </article>
    `;
}

function crearPublicacionDetalle(publicacion) {
    return `
        <article class="post">
            <header class="post-header">
                <div class="publicacion-usuario">
                    <a class="avatar-link" href="perfil.html">
                        <span class="avatar av-1">
                            ${publicacion.usuario}
                        </span>
                    </a>

                    <p class="comunidad-info post-data">
                        Publicado en
                        <strong>c/${publicacion.comunidad}</strong>
                        por
                        <a href="perfil.html">@${publicacion.usuario}</a>
                        •
                        <time>${publicacion.fecha}</time>
                    </p>
                </div>

                <h2 class="post-titulo">
                    ${publicacion.titulo}
                </h2>
            </header>

            <aside class="post-votos" aria-label="Votación">
                <button type="button" aria-label="Votar a favor">
                    ▲
                </button>

                <span>${publicacion.votos}</span>

                <button type="button" aria-label="Votar en contra">
                    ▼
                </button>
            </aside>

            <section class="post-contenido">
                <p>${publicacion.contenido}</p>
            </section>

            <footer class="post-footer">
                <a href="#seccion-comentarios" class="boton-comentarios">
                    Comentar (${publicacion.comentarios.length})
                </a>

                <button type="button">Compartir</button>
                <button type="button">Guardar</button>
            </footer>
        </article>
    `;
}


function renderizarComentarios(publicacion) {

    return publicacion.comentarios
        .map(comentario => {
            return crearComentario(
                comentario,
                publicacion.comunidad
            );
        })
        .join("");
}

/* function renderizarPublicaciones() {

    const feed = document.querySelector(".feed-publicaciones");

    if (!feed) {
        return;
    }

    feed.innerHTML = "";

    window.publicaciones.forEach(publicacion => {

        feed.innerHTML += crearPublicacion(publicacion);

    });

} */

async function cargarMasPublicaciones() {
    const feed = document.querySelector(".feed-publicaciones");
    const boton = document.querySelector("#boton-cargar-mas");
    const mensaje = document.querySelector("#mensaje-carga");

    // Si no estamos en el inicio, no hacemos nada.
    if (!feed || !boton) {
        return;
    }

    // Evitamos que se ejecuten dos cargas al mismo tiempo.
    if (cargandoPublicaciones) {
        return;
    }

    cargandoPublicaciones = true;
    boton.disabled = true;
    boton.textContent = "Cargando...";

    try {
        const respuesta = await obtenerPublicaciones(
            numeroPaginaActual,
            TAMANIO_PAGINA
        );

        respuesta.items.forEach(publicacion => {
            feed.insertAdjacentHTML(
                "beforeend",
                crearPublicacion(publicacion)
            );
        });

        // Avanzamos de pagina si quedan publicaciones
        
        if (respuesta.items.length > 0) {
            numeroPaginaActual++;
        }

        // Si ya no hay publicaciones se oculta
        boton.hidden = !respuesta.hayMas;

        if (mensaje) {
            mensaje.textContent = respuesta.hayMas
                ? ""
                : "No hay más publicaciones.";
        }
    } catch (error) {
        console.error("Error al cargar publicaciones:", error);

        if (mensaje) {
            mensaje.textContent =
                "No se pudieron cargar las publicaciones. Intentá nuevamente.";
        }

        boton.hidden = false;
    } finally {
        cargandoPublicaciones = false;

        if (!boton.hidden) {
            boton.disabled = false;
            boton.textContent = "Cargar más publicaciones";
        }
    }
}

function renderizarDetallePublicacion() {
    const contenedorPublicacion = document.querySelector(
        "#detalle-publicacion"
    );

    const contenedorComentarios = document.querySelector(
        "#seccion-comentarios"
    );

    const tituloComentarios = document.querySelector(
        "#titulo-comentarios"
    );

    // Si no estamos en publicacion.html, terminamos.
    if (!contenedorPublicacion || !contenedorComentarios) {
        return;
    }

    // Obtenemos el ID que viene en la URL.
    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));

    // Buscamos la publicación que tenga ese ID.
    const publicacion = window.publicaciones.find(
        publicacion => publicacion.id === id
    );

    // Si el ID no existe, mostramos un mensaje.
    if (!publicacion) {
        contenedorPublicacion.innerHTML = `
            <p>No se encontró la publicación.</p>
            <a href="index.html">Volver al inicio</a>
        `;

        contenedorComentarios.innerHTML = "";
        tituloComentarios.textContent = "Comentarios";

        return;
    }

    // Insertamos la publicación seleccionada.
    contenedorPublicacion.innerHTML = crearPublicacionDetalle(publicacion);

    // Insertamos solamente sus comentarios.
    contenedorComentarios.innerHTML = renderizarComentarios(publicacion);

    // Actualizamos el título con la cantidad de comentarios.
    const cantidad = publicacion.comentarios.length;

    tituloComentarios.textContent =
        cantidad === 1
            ? "Comentarios (1)"
            : `Comentarios (${cantidad})`;
}

async function obtenerPublicaciones(pagina, limite) {
    const inicio = pagina * limite;
    const fin = inicio + limite;

    const publicaciones = window.publicaciones.slice(inicio, fin);

    return {
        items: publicaciones,
        hayMas: fin < window.publicaciones.length
    };
}