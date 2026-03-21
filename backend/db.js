const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  /*
  ssl: {
    rejectUnauthorized: true
  }
  */
});

// Using pool.query() directly is recommended, but we can verify the pool
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection pool failed:", err);
    console.error("Connection details:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT || 4000,
      database: process.env.DB_NAME
    });
  } else {
    console.log("Connected to MySQL database pool");
    connection.release();
  }
});

module.exports = db;