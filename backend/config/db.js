const mysql = require("mysql2/promise"); // Note the /promise here
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

});

// Test the connection
pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL Pool Connected...");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Pool Connection Error:", err);
  });

module.exports = pool;