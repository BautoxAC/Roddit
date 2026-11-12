const { Pool } = require('pg');

// Un unico "pool" de conexiones a Postgres, compartido por toda la app.
module.exports = new Pool({ connectionString: process.env.DATABASE_URL });
