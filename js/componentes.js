
function crearHeader(paginaActual) {
    return `
        
            <div class="header-dentro">

                <a class="logo" href="index.html"
                   aria-label="Roddit, ir al inicio">

                    <span class="logo-icono" aria-hidden="true">R</span>
                    <span>roddit</span>

                </a>

                <nav class="main-nav" aria-label="Principal">
                    <ul>
                        <li>
                            <a href="index.html"
                               ${paginaActual === "inicio" ? 'aria-current="page"' : ""}>
                                Inicio
                            </a>
                        </li>

                        <li>
                            <a href="perfil.html"
                               ${paginaActual === "perfil" ? 'aria-current="page"' : ""}>
                                Perfil
                            </a>
                        </li>
                    </ul>
                </nav>

                <div class="busqueda" role="search">
                    <input type="search"
                           id="buscar"
                           name="q"
                           placeholder="Buscar en Roddit">
                </div>

                <div class="header-actions">

                    <button type="button" class="boton-create">
                        + Crear
                    </button>

                    <button type="button"
                            class="icono-boton"
                            aria-label="Notificaciones">

                        <img src="./Utils/campana.png"
                             alt="">

                    </button>

                    <a class="avatar-link"
                       href="perfil.html"
                       aria-label="Ver mi perfil (PehuenDev)">

                        <span class="avatar av-1" aria-hidden="true">
                            Dev
                        </span>

                    </a>

                </div>

            </div>

    `;
}


function crearFooter() {
    return `


            <div class="footer-dentro">

                <p>
                    © 2026 Roddit. Proyecto académico – Facultad de Informática, UNCo.
                </p>

                <nav aria-label="Enlaces legales">
                    <ul>
                        <li><a href="#">Reglas</a></li>
                        <li><a href="#">Privacidad</a></li>
                        <li><a href="#">Acuerdo de usuario</a></li>
                        <li><a href="#">Accesibilidad</a></li>
                    </ul>
                </nav>

            </div>

    `;
}
