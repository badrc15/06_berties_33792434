const express = require("express");
const router = express.Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        // Only store redirect if not already on login or logout page
        if (!req.originalUrl.includes('/login') && !req.originalUrl.includes('/logout')) {
            req.session.redirectTo = req.originalUrl;
        }
        return res.redirect(req.baseUrl + '/login');
    }
    next();
};


// Home page
router.get('/', (req, res) => {
    res.render('index.ejs');
});

// About page
router.get('/about', (req, res) => {
    res.render('about.ejs');
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
