function crearPresentacionPerfil(usuario) {
    return `
        <span class="avatarPerfil">${usuario.avatar}</span>
        <h2>${usuario.nombre}</h2>
        <p>@${usuario.usuario}</p>
        <p>${usuario.descripcion}</p>
    `;
}

function crearEstadisticas(estadisticas) {
    return estadisticas
        .map(estadistica => `
            <h4>
                <dt>${estadistica.etiqueta}</dt>
                <dd>${estadistica.valor}</dd>
            </h4>
        `)
        .join("");
}

function crearDatosCuenta(cuenta) {
    return cuenta
        .map(dato => `
            <dt>${dato.etiqueta}</dt>
            <dd>${dato.valor}</dd>
        `)
        .join("");
}

function crearActividadPorComunidad(actividad) {
    return actividad
        .map(fila => `
            <tr>
                <td>c/${fila.comunidad}</td>
                <td>${fila.publicaciones}</td>
                <td>${fila.comentarios}</td>
                <td>${fila.karma}</td>
            </tr>
        `)
        .join("");
}

function crearPublicacionReciente(publicacion) {
    const cantidad = publicacion.comentarios.length;

    return `
        <li>
            <h3 class="mini-post">
                <a class="mini-titulo" href="publicacion.html?id=${publicacion.id}">
                    ${publicacion.titulo}
                </a>
                <span class="info-publicacion">c/${publicacion.comunidad} - ${publicacion.fecha} - ${cantidad} ${cantidad === 1 ? "Comentario" : "Comentarios"}</span>
            </h3>
        </li>
    `;
}

function crearItemsLista(items, prefijo = "") {
    return items.map(item => `<li>${prefijo}${item}</li>`).join("");
}

function renderizarPerfil() {
    const usuario = window.usuario;

    const presentacion = document.querySelector("#perfil-presentacion");
    const estadisticas = document.querySelector("#perfil-estadisticas");
    const cuenta = document.querySelector("#perfil-cuenta");
    const actividad = document.querySelector("#perfil-actividad");
    const recientes = document.querySelector("#perfil-publicaciones");
    const logros = document.querySelector("#perfil-logros");
    const comunidades = document.querySelector("#perfil-comunidades");

    // Si no estamos en perfil.html, terminamos.
    if (!presentacion) {
        return;
    }

    presentacion.innerHTML = crearPresentacionPerfil(usuario);
    estadisticas.innerHTML = crearEstadisticas(usuario.estadisticas);
    cuenta.innerHTML = crearDatosCuenta(usuario.cuenta);
    actividad.innerHTML = crearActividadPorComunidad(usuario.actividadPorComunidad);

    // Publicaciones recientes: las que escribio este usuario,
    // tomadas de publicaciones.js (asi el link lleva a publicacion.html?id=...)
    const publicacionesDelUsuario = window.publicaciones.filter(
        publicacion => publicacion.usuario === usuario.usuario
    );

    recientes.innerHTML = publicacionesDelUsuario.length > 0
        ? publicacionesDelUsuario.map(crearPublicacionReciente).join("")
        : "<li>Todavia no hay publicaciones.</li>";

    logros.innerHTML = crearItemsLista(usuario.logros);
    comunidades.innerHTML = crearItemsLista(usuario.comunidades, "c/");
}
