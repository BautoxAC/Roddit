// Convierte un texto en HTML seguro: los datos que vienen de la API
// (que pudieron ser escritos por cualquier usuario) nunca se interpretan como HTML.
function escaparHtml(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Convierte una fecha ISO (la que manda la API) en "hace 5 m", "hace 2 h", "hace 3 días"
function tiempoRelativo(fechaIso) {
    const segundos = Math.floor((Date.now() - new Date(fechaIso).getTime()) / 1000);

    if (Number.isNaN(segundos)) {
        return "";
    }
    if (segundos < 60) {
        return "hace un momento";
    }

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
        return `hace ${minutos} m`;
    }

    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
        return `hace ${horas} h`;
    }

    const dias = Math.floor(horas / 24);
    return dias === 1 ? "hace 1 día" : `hace ${dias} días`;
}
