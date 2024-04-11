const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8698234',
    password: 'fWYZTpee9U',
    database: 'sql8698234',
    port: 3306
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting:", error);
    } else {
        console.log("Connection successful");
    }
});

app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Insert new user into the database
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [username, password];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ success: false, message: 'Error registering user' });
            return;
        }

        console.log('User registered successfully');
        res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});
// Endpoint to handle user login

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Perform authentication logic
    // Example authentication logic using MySQL
function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const values = [username, password];
        
        connection.query(sql, values, (err, results) => {
            if (err) {
                // Error occurred during database query
                reject(err);
            } else {
                // Check if user exists and password is correct
                if (results.length > 0) {
                    // User found, resolve with the user object
                    resolve(results[0]);
                } else {
                    // User not found or password incorrect, resolve with null
                    resolve(null);
                }
            }
        });
    });
}

    // Assume you have a function authenticateUser(username, password) that returns a Promise

    authenticateUser(username, password)
        .then(user => {
            if (!user) {
                // User not found or invalid credentials
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            
            // Authentication successful
           // res.status(200).json({ message: 'Login successful', user });
           console.log('login successful');
            res.status(200).json({ success: true, message: 'login successful', user });
        })
        .catch(error => {
            // Handle other errors (e.g., database error)
            console.error('Error during authentication:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
});

// Endpoint to handle adding expenses
app.post('/add-expense', (req, res) => {
    // Log the request payload
    console.log('Request payload:', req.body);

    const { name, amount } = req.body;

    // Execute the SQL query to insert expense into database
    const sql = 'INSERT INTO expenses (name, amount) VALUES (?, ?)';
    const data = [name, amount];

    connection.query(sql, data, (err, results) => {
        if (err) {
            console.error('Error adding expense to database:', err);
            res.status(500).json({ message: 'Error adding expense to database' });
            return;
        }

        res.status(200).json({ message: 'Expense added successfully' });
    });
});
app.get('/get-expenses', (req, res) => {
    const sql = 'SELECT * FROM expenses';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving expenses:', err);
            res.status(500).json({ message: 'Error retrieving expenses' });
            return;
        }

        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
