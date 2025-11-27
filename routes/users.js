const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        // Only store redirect if not already on login or logout page
        if (!req.originalUrl.includes('/login') && !req.originalUrl.includes('/logout')) {
            req.session.redirectTo = req.originalUrl;
        }
        return res.redirect('/users/login');
    }
    next();
};


// -------------------
// GET: Show registration form
// -------------------
router.get('/register', (req, res) => {
    res.render('register.ejs');
});

// -------------------
// POST: Handle registration
// -------------------
router.post('/registered', (req, res) => {
    const { username, first, last, email, password } = req.body;
    if (!username || !first || !last || !email || !password) {
        return res.send("Please fill in all fields.");
    }

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return res.send("Error hashing password");

        const sql = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        const values = [username, first, last, email, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) return res.send("Error saving user to database");

            res.send(`Hello ${first} ${last}, you are now registered!<br>
                      Your password is: ${password}<br>
                      Your hashed password is: ${hashedPassword}`);
        });
    });
});

// -------------------
// GET: Show login form
// -------------------
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

// -------------------
// POST: Handle login
// -------------------
router.post('/loggedin', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.send("Please enter both username and password.");

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.send("Database error");

        if (results.length === 0) {
            db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, false]);
            return res.send("Login failed: username not found.");
        }

        const user = results[0];

        bcrypt.compare(password, user.hashedPassword, (err, match) => {
            if (err) return res.send("Error verifying password");

            const success = match ? true : false;
            db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, success]);

            if (match) {
                req.session.userId = user.username;
                const redirectTo = req.session.redirectTo || '/books/list';
                delete req.session.redirectTo; // clear it after using
                return res.redirect(redirectTo);
            } else {
                return res.send("Login failed: incorrect password.");
            }
        });
    });
});

// -------------------
// GET: Show audit history - PROTECTED
// -------------------
router.get('/audit', redirectLogin, (req, res) => {
    db.query("SELECT * FROM login_audit ORDER BY timestamp DESC", (err, results) => {
        if (err) return res.send("Error retrieving audit history");
        res.render('audit.ejs', { audit: results });
    });
});

router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        // Clear redirectTo so old value is gone
        req.session = null; 
        res.render('logout.ejs');
    });
});



module.exports = router;
