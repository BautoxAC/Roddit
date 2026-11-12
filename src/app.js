const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());                                              // lee el body JSON
app.use(express.static(path.join(__dirname, '..', 'public')));        // sirve la web
app.use('/api/publicaciones', require('./publicaciones'));            // la API

// Errores inesperados: siempre responden JSON, nunca una pagina HTML.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
