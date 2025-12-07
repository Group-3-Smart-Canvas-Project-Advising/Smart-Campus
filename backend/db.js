// backend/db.js
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
};

let poolPromise;

function getPool() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Connected to Azure SQL.');
                return pool;
            })
            .catch(err => {
                poolPromise = undefined; // allow retry on next call
                console.error('Azure SQL connection error:', err);
                throw err;
            });
    }
    return poolPromise;
}

async function query(text, params = []) {
    const pool = await getPool();
    const request = pool.request();
    params.forEach(({ name, type, value }) => {
        if (type) {
            request.input(name, type, value);
        } else {
            request.input(name, value);
        }
    });
    return request.query(text);
}

module.exports = { sql, getPool, query };