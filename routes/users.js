const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// GET: Show registration form
router.get('/register', function(req, res) {
    res.render('register.ejs'); // Ensure this exists in /views
});

// POST: Handle registration
router.post('/registered', function(req, res) {
    const { username, first, last, email, password } = req.body;

    console.log('Form data received:', req.body);

    if (!username || !first || !last || !email || !password) {
        return res.send("Please fill in all fields.");
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
        if (err) {
            console.error("Error hashing password:", err);
            return res.send("Error hashing password");
        }

        // Insert into database
        const sql = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        const values = [username, first, last, email, hashedPassword];

        db.query(sql, values, function(err, result) {
            if (err) {
                console.error("Database insertion error:", err);
                return res.send("Error saving user to database");
            }

            // Send confirmation with password + hashedPassword
            let resultMsg = 'Hello ' + first + ' ' + last +
                ', you are now registered! We will send an email to you at ' + email + '<br>';
            resultMsg += 'Your password is: ' + password +
                '<br>Your hashed password is: ' + hashedPassword;

            res.send(resultMsg);
        });
    });
});

// GET: List all users (no passwords)
router.get('/list', function(req, res) {
    const sql = "SELECT username, first, last, email FROM users";

    db.query(sql, function(err, results) {
        if (err) {
            console.error("Database error:", err);
            return res.send("Error retrieving users from database");
        }

        res.render('listusers.ejs', { users: results });
    });
});

// GET: Show login form
router.get('/login', function(req, res) {
    res.render('login.ejs'); // Ensure this exists in /views
});

// POST: Handle login verification
router.post('/loggedin', function(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Please enter both username and password.");
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], function(err, results) {
        if (err) {
            console.error("Database error:", err);
            return res.send("Error retrieving user from database");
        }

        if (results.length === 0) {
            // Log failed login attempt
            const auditSql = "INSERT INTO login_audit (username, success) VALUES (?, ?)";
            db.query(auditSql, [username, false], (err2) => {
                if (err2) console.error("Audit log error:", err2);
            });

            return res.send("Login failed: username not found.");
        }

        const user = results[0];

        bcrypt.compare(password, user.hashedPassword, function(err, result) {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.send("Error verifying password");
            }

            const auditSql = "INSERT INTO login_audit (username, success) VALUES (?, ?)";
            if (result === true) {
                // Successful login
                db.query(auditSql, [username, true], (err2) => {
                    if (err2) console.error("Audit log error:", err2);
                });
                res.send(`Hello ${user.first} ${user.last}, you have successfully logged in!`);
            } else {
                // Failed login
                db.query(auditSql, [username, false], (err2) => {
                    if (err2) console.error("Audit log error:", err2);
                });
                res.send("Login failed: incorrect password.");
            }
        });
    });
});

// GET route to show audit history
router.get('/audit', function(req, res) {
    const sql = "SELECT * FROM login_audit ORDER BY timestamp DESC";

    db.query(sql, function(err, results) {
        if (err) {
            console.error("Database error:", err);
            return res.send("Error retrieving audit history");
        }

        res.render('audit.ejs', { audit: results });
    });
});


module.exports = router;
