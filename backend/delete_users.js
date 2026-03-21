require('dotenv').config();
const mysql = require('mysql2/promise');

async function cleanupUsers() {
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

    console.log('--- Connection Config ---');
    console.log('Host:', config.host);
    console.log('Database:', config.database);
    console.log('-------------------------');

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to TiDB Cloud.');

        // Identify the user to keep
        const keepEmail = 'guest@example.com';

        // Delete all users except the one with the specified email
        // ON DELETE CASCADE will handle itineraries, favorites, and reviews automatically
        const [result] = await connection.execute(
            'DELETE FROM users WHERE email <> ?',
            [keepEmail]
        );

        console.log(`\nCleanup complete.`);
        console.log(`Users deleted: ${result.affectedRows}`);
        
        // List remaining users to verify
        const [remaining] = await connection.execute('SELECT user_id, name, email FROM users');
        console.log('\n--- Remaining Users ---');
        remaining.forEach(u => console.log(`ID: ${u.user_id} | Name: ${u.name} | Email: ${u.email}`));

        await connection.end();
    } catch (error) {
        console.error('Error during cleanup:', error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
             console.log('Attempting to connect without database to list databases...');
             const connection = await mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                port: config.port,
                ssl: config.ssl
             });
             const [databases] = await connection.execute('SHOW DATABASES');
             console.log('Available databases:', databases.map(db => db.Database).join(', '));
             await connection.end();
        }
    }
}

cleanupUsers();
