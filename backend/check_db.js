require('dotenv').config();
const mysql = require('mysql2');

console.log('--- DB Config ---');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT || 4000);
console.log('Has Password:', !!(process.env.DB_PASS || process.env.DB_PASSWORD));
console.log('-----------------');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000
    // Removed SSL for testing
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed (No SSL):', err.message);
        console.error('Error Code:', err.code);
        process.exit(1);
    }
    console.log('Connection successful without SSL!');
    process.exit();
});
