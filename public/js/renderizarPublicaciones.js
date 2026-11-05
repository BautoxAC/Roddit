const TAMANIO_PAGINA = 5;

let publicacionesCargadas = 0;
let cargandoPublicaciones = false;


function crearPublicacion(publicacion) {

    const cantidadComentarios = publicacion.cantidadComentarios;

    return `
        <article class="post">

            <header class="post-header">

                <div class="publicacion-usuario">

                    <a class="avatar-link"
                       href="perfil.html"
                       aria-label="Ver perfil de ${escaparHtml(publicacion.usuario)}">

                        <span class="avatar av-1" aria-hidden="true">
                            ${escaparHtml(publicacion.avatar)}
                        </span>

                    </a>

                    <p class="comunidad-info post-data">

                        Publicado en
                        <strong>c/${escaparHtml(publicacion.comunidad)}</strong>

                        por
                        <a href="perfil.html">@${escaparHtml(publicacion.usuario)}</a>

                        •
                        <time datetime="${publicacion.creadaEn}">${tiempoRelativo(publicacion.creadaEn)}</time>

                    </p>

                </div>

                <h2 class="post-titulo">

                    <a href="publicacion.html?id=${publicacion.id}">
                        ${escaparHtml(publicacion.titulo)}
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

                <p>${escaparHtml(publicacion.contenido)}</p>

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
                       aria-label="Ver perfil de ${escaparHtml(comentario.usuario)}">

                        <span class="avatar av-1" aria-hidden="true">
                            ${escaparHtml(comentario.avatar)}
                        </span>

                    </a>

                    <p class="comunidad-info post-data">

                        Comentario en
                        <strong>c/${escaparHtml(comunidad)}</strong>

                        por
                        <a href="perfil.html">@${escaparHtml(comentario.usuario)}</a>

                        •
                        <time datetime="${comentario.creadaEn}">${tiempoRelativo(comentario.creadaEn)}</time>

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

                <p>${escaparHtml(comentario.contenido)}</p>

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
                            ${escaparHtml(publicacion.usuario)}
                        </span>
                    </a>

                    <p class="comunidad-info post-data">
                        Publicado en
                        <strong>c/${escaparHtml(publicacion.comunidad)}</strong>
                        por
                        <a href="perfil.html">@${escaparHtml(publicacion.usuario)}</a>
                        •
                        <time datetime="${publicacion.creadaEn}">${tiempoRelativo(publicacion.creadaEn)}</time>
                    </p>
                </div>

                <h2 class="post-titulo">
                    ${escaparHtml(publicacion.titulo)}
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
                <p>${escaparHtml(publicacion.contenido)}</p>
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
            publicacionesCargadas,
            TAMANIO_PAGINA
        );

        respuesta.items.forEach(publicacion => {
            feed.insertAdjacentHTML(
                "beforeend",
                crearPublicacion(publicacion)
            );
        });

        // Avanzamos: la proxima pagina empieza despues de las que ya tenemos
        publicacionesCargadas += respuesta.items.length;

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

async function renderizarDetallePublicacion() {
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
    const id = parametros.get("id");

    try {
        const respuesta = await fetch(
            `/api/publicaciones/${encodeURIComponent(id)}`
        );

        // Si el ID no existe (404) o no es valido (400), mostramos un mensaje.
        if (respuesta.status === 404 || respuesta.status === 400) {
            contenedorPublicacion.innerHTML = `
                <p>No se encontró la publicación.</p>
                <a href="index.html">Volver al inicio</a>
            `;

            contenedorComentarios.innerHTML = "";
            tituloComentarios.textContent = "Comentarios";

            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status} al pedir la publicación`);
        }

        const publicacion = await respuesta.json();

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
    } catch (error) {
        console.error("Error al cargar la publicación:", error);

        contenedorPublicacion.innerHTML = `
            <p>No se pudo cargar la publicación. Intentá nuevamente.</p>
            <a href="index.html">Volver al inicio</a>
        `;

        contenedorComentarios.innerHTML = "";
        tituloComentarios.textContent = "Comentarios";
    }
}

// Pide una pagina de publicaciones a la API.
// La API responde { items, total, hayMas }.
async function obtenerPublicaciones(desde, cantidad) {
    const respuesta = await fetch(
        `/api/publicaciones?cantidad=${cantidad}&from=${desde}`
    );

    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al pedir publicaciones`);
    }

    return respuesta.json();
}
