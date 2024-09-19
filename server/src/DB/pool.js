var pg = require('pg');

const pool = new pg.Pool({
    user: process.env.DB_USER || 'pg',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'maps',
    password: process.env.DB_PASS || 'pg',
    port: 5432,
});

module.exports = pool;