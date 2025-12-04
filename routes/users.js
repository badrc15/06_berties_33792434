// -------------------
// Required Modules
// -------------------
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { check, validationResult } = require("express-validator");

// -------------------
// LOGIN REDIRECT MIDDLEWARE
// -------------------
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        if (!req.originalUrl.includes("/login") && !req.originalUrl.includes("/logout")) {
            req.session.redirectTo = req.originalUrl;
        }
        return res.redirect(req.baseUrl + "/login")
    }
    next();
};

// -------------------
// GET: Registration Form
// -------------------
router.get("/register", (req, res) => {
    res.render("register", { errors: [], oldData: {} });
});

// -------------------
// POST: Registration Handler WITH VALIDATION + SANITISATION
// -------------------
router.post(
    "/registered",
    [
        check("email")
            .isEmail().withMessage("Please enter a valid email")
            .isLength({ max: 50 }).withMessage("Email cannot exceed 50 characters"),

        check("username")
            .isLength({ min: 5, max: 100 }).withMessage("Username must be between 5–20 characters"),

        check("password")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("register", {
                errors: errors.array(),
                oldData: req.body
            });
        }

        // SANITISE ALL USER INPUT
        const username = req.sanitize(req.body.username);
        const first = req.sanitize(req.body.first);
        const last = req.sanitize(req.body.last);
        const email = req.sanitize(req.body.email);
        const password = req.sanitize(req.body.password);

        if (!username || !first || !last || !email || !password) {
            return res.send("Please fill in all fields.");
        }

        // HASH PASSWORD
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
    }
);

// -------------------
// GET: Login Form
// -------------------
router.get("/login", (req, res) => {
    res.render("login", { errors: [], oldData: {} });
});

// -------------------
// POST: Login Handler
// -------------------
router.post("/loggedin", (req, res) => {
    const username = req.sanitize(req.body.username);
    const password = req.sanitize(req.body.password);

    if (!username || !password) {
        return res.send("Please enter both username and password.");
    }

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

            db.query("INSERT INTO login_audit (username, success) VALUES (?, ?)", [username, match]);

            if (!match) {
                return res.send("Login failed: incorrect password.");
            }

            req.session.userId = user.username;

            // Redirect after login
            // If redirectTo exists, use it. Otherwise, go to loggedin page.
            let redirectTo = req.session.redirectTo || req.baseUrl + "/loggedin";
            delete req.session.redirectTo;

            // Fix: ensure redirectTo includes /usr/459 prefix if on VM
            if (!redirectTo.startsWith(req.baseUrl)) {
                redirectTo = req.baseUrl + redirectTo;
            }

            res.redirect(redirectTo);
        });
    });
});

router.get("/loggedin", (req, res) => {
    // Optional: check if user is logged in
    if (!req.session.userId) {
        return res.redirect(req.baseUrl + "/login");
    }

    res.render("loggedin", { username: req.session.userId });
});


// -------------------
// GET: Audit Page (PROTECTED)
// -------------------
router.get("/audit", redirectLogin, (req, res) => {
    db.query("SELECT * FROM login_audit ORDER BY timestamp DESC", (err, results) => {
        if (err) return res.send("Error retrieving audit history");
        res.render("audit", { audit: results });
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect("/");
        }
        res.render("logout");
    });
});

module.exports = router;
