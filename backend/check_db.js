require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        process.exit(1);
    }
    db.query('SELECT * FROM countries WHERE name = ?', ['Australia'], (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(results);
        }
        process.exit();
    });
});
