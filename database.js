const mysql = require('mysql');

// Create a connection to the database

// NOTE: This is not a secure way to store your password.  We will
// learn how to do this properly in a later module.
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'tasks',
    user: 'root',
    password: 'Shaik@786'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

// Export the connection
module.exports = connection;