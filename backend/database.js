const { Pool } = require('pg'); // <-- ESSA LINHA É OBRIGATÓRIA

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Dash.app',
    password: 'Maxsuel123',
    port: 5432,
});

module.exports = pool;
