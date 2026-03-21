require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabaseContent() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS || process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 4000,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to TiDB Cloud.');

        const tables = ['countries', 'cities', 'users', 'categories', 'places'];
        console.log('\n--- Table Row Counts ---');
        
        for (const table of tables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`${table.padEnd(12)}: ${rows[0].count} rows`);
            } catch (err) {
                console.log(`${table.padEnd(12)}: TABLE MISSING or ERROR (${err.message})`);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Error checking database content:', error.message);
    }
}

checkDatabaseContent();
