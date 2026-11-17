# Roddit

## Para esta guia se utilizo IA para el formato , y mejorar la explicacion. El contenido de la misma fue escrito a mano##

Foro simple con publicaciones, comentarios y perfil de usuario. Trabajo Práctico Obligatorio 2 y 3 de **Servidores Web**.

- **Front:** HTML, CSS y JavaScript puro (sin frameworks).
- **Back:** Node.js + Express, con una API REST bajo `/api/publicaciones`.
- **Base de datos:** PostgreSQL, que corre dentro de un contenedor de Docker.

## 1. Requisitos

Necesitás tener instalado:

| Herramienta | Versión | Cómo verificarla |
|---|---|---|
| **Git** | cualquiera | `git --version` |
| **Node.js** | **20.6 o superior** | `node --version` |
| **Docker Desktop** (incluye Docker Compose) | reciente | `docker --version` y `docker compose version` |

### Paso a Paso para ejecutar el codigo
### Paso 1: clonar el repositorio

```bash
git clone https://github.com/BautoxAC/Roddit.git
cd Roddit
```

### Paso 2: instalar las dependencias

```bash
npm install
```

### Paso 3: crear el archivo de variables de entorno

El archivo `.env` no se sube a GitHub, así que hay que crearlo a partir del ejemplo, se puede crear ejecutando este comando:

```bash
cp .env.example .env
```

*(En Windows CMD)* No hace falta editarlo: ya trae los valores que coinciden con el `docker-compose.yml`.

### Paso 4: levantar la base de datos

```bash
docker compose up -d
```

La primera vez descarga la imagen de PostgreSQL, así que puede tardar un poco. Para comprobar que esté lista:

```bash
docker compose ps
```

En la columna `STATUS` tiene que decir **`healthy`** (esperá unos segundos si todavía dice `starting`).

Al crearse por primera vez, la base ejecuta automáticamente `db/init.sql`, que crea las tablas y carga datos de ejemplo. Para confirmarlo:

```bash
docker compose exec db psql -U roddit -d roddit -c "SELECT count(*) FROM publicaciones;"
```

Tiene que mostrar `20`, que son la cantidad de publicaciones creadas.

### Paso 5: iniciar el servidor

```bash
npm run dev
```

Tiene que aparecer `Servidor en http://localhost:3000`.

### Paso 6: abrir la web

Entrá a **http://localhost:3000**. Si ves el feed con publicaciones, todo está funcionando.

## 3. Qué probar en la web

| Página | URL | Qué muestra |
|---|---|---|
| Inicio | `http://localhost:3000/` | Feed de publicaciones. Carga 5 al abrir y 5 más cada vez que se hace clic en **"Cargar más publicaciones"**. |
| Detalle | `http://localhost:3000/publicacion.html?id=1` | Una publicación con sus comentarios. Con un id inexistente muestra "No se encontró la publicación". |
| Perfil | `http://localhost:3000/perfil.html` | Datos del usuario y sus publicaciones recientes. |


## 4. Probar la API

Con el servidor andando, estos son los endpoints (todos devuelven JSON):

| Método | URL | Qué hace | Respuestas |
|---|---|---|---|
| `GET` | `/api/publicaciones` | Lista paginada | `200`, `400` |
| `GET` | `/api/publicaciones/:id` | Una publicación con sus comentarios | `200`, `400`, `404` |
| `POST` | `/api/publicaciones` | Crea una publicación | `201`, `400` |
| `PUT` | `/api/publicaciones/:id` | Edita título, comunidad y contenido | `200`, `400`, `404` |
