const express = require("express");
const router = express.Router();

// Search page
router.get('/search', function(req, res, next) {
    res.render("search.ejs");
});

// Advanced search: partial match
router.get('/searchresult', function(req, res, next) {
    const keyword = req.query.keyword;

    let sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    let searchParam = `%${keyword}%`;

    db.query(sqlquery, [searchParam], (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('searchresult.ejs', { searchResults: result, keyword: keyword });
        }
    });
});

// List all books
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("list.ejs", { availableBooks: result }); // updated line
        }
    });
});

// Route to show add book form
router.get('/addbook', function(req, res, next) {
    res.render('addbook.ejs');
});

// Route to handle form submission and save to database
router.post('/bookadded', function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book has been added to the database!<br>Name: ' + req.body.name + '<br>Price: $' + Number(req.body.price).toFixed(2));
        }
    });
});

// Route to show all books priced less than £20
router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT name, price FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('bargainbooks.ejs', { bargainBooks: result });
        }
    });
});


module.exports = router;
