const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// MySQL connection setup
const db = mysql.createConnection({
    host: process.dotenv.DB_HOST ,
    user: process.dotenv.DB_USER ,
    password: process.dotenv.DB_PASS ,
    database: process.dotenv.DB_NAME ,
    port: process.dotenv.DB_PORT 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Helper function to log detailed database errors
function logDbError(err) {
    if (err) {
        console.error('MySQL Error:', err.code, err.errno, err.sqlMessage);
    }
}

// Signup route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        // Check if user already exists
            db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
                if (err) {
                    logDbError(err);
                    return res.status(500).json({ message: 'Database error' });
                }
                if (results.length > 0) {
                    return res.status(409).json({ message: 'Username already exists' });
                }
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);
                // Insert new user
                db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
                    if (err) {
                        logDbError(err);
                        return res.status(500).json({ message: 'Database error' });
                        
                    }
                    return res.status(201).json({ message: 'User created successfully' });
                });
            });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Successful login
        return res.status(200).json({ message: 'Login successful' });
    });
});

module.exports = router;
