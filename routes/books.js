const express = require("express");
const router = express.Router();

// Middleware: Protect routes
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};

// Search page
router.get('/search', (req, res) => {
    res.render("search.ejs");
});

// Advanced search: partial match
router.get('/searchresult', (req, res, next) => {
    const keyword = req.query.keyword;
    const sql = "SELECT name, price FROM books WHERE name LIKE ?";
    db.query(sql, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);
        res.render('searchresult.ejs', { searchResults: result, keyword });
    });
});

// List all books - PROTECTED
router.get('/list', redirectLogin, (req, res, next) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});

// Add book form - PROTECTED
router.get('/addbook', redirectLogin, (req, res) => {
    res.render('addbook.ejs');
});

// Add book to database - PROTECTED
router.post('/bookadded', redirectLogin, (req, res, next) => {
    const sql = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sql, [req.body.name, req.body.price], (err, result) => {
        if (err) return next(err);
        res.send(`Book added!<br>Name: ${req.body.name}<br>Price: $${Number(req.body.price).toFixed(2)}`);
    });
});

// Show bargain books
router.get('/bargainbooks', (req, res, next) => {
    db.query("SELECT name, price FROM books WHERE price < 20", (err, result) => {
        if (err) return next(err);
        res.render('bargainbooks.ejs', { bargainBooks: result });
    });
});

module.exports = router;
