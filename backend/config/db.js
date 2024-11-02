const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// MySQL connection
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Use 'db' when running in Docker
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test MySQL connection
async function testMySQLConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL connected successfully');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('MySQL connection error:', err);
    }
}

// Call the function to test MySQL connection
testMySQLConnection(); 

// Export both mongoose and pool for use in other modules
module.exports = { mongoose, pool };
