// Import modules
const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv').config();
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');
const expressSanitizer = require('express-sanitizer');
const weatherRoutes = require('./routes/weather');


// Database connection pool
const db = mysql.createPool({
    host: process.env.BB_HOST,
    user: process.env.BB_USER,
    password: process.env.BB_PASS,
    database: process.env.BB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Create Express app
const app = express();
const port = 8000;

// Enable session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

// Body parser
app.use(express.urlencoded({ extended: true }));


// Create an input sanitizer
app.use(expressSanitizer());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS templating engine
app.set('view engine', 'ejs');

// App-specific data
app.locals.shopData = { shopName: "Bertie's Books" };

// Load routes
const mainRoutes = require("./routes/main");
const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');

app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/', weatherRoutes);
app.use('/api', require('./routes/api')(db));

// Start server
app.listen(port, () => console.log(`App listening on port ${port}`));
