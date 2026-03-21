require('dotenv').config();
const mysql = require('mysql2/promise');

async function listUsers() {
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

        const [rows] = await connection.execute('SELECT user_id, name, email, created_at FROM users');
        
        console.log('\n--- Existing Users ---');
        if (rows.length === 0) {
            console.log('No users found.');
        } else {
            rows.forEach(user => {
                console.log(`ID: ${user.user_id} | Name: ${user.name.padEnd(15)} | Email: ${user.email}`);
            });
        }

        await connection.end();
    } catch (error) {
        console.error('Error fetching users:', error.message);
    }
}

listUsers();
