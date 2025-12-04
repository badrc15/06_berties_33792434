const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    router.get('/books', (req, res, next) => {
        // Extract query parameters
        const search = req.query.search || '';        // search keyword
        const minPrice = req.query.minprice;          // minimum price
        const maxPrice = req.query.maxprice || req.query['max_price'];       // maximum price
        const sort = req.query.sort;                  // sort by 'name' or 'price'

        // Start SQL query
        let sqlquery = "SELECT * FROM books WHERE 1=1";
        const params = [];

        // Add search condition
        if (search) {
            sqlquery += " AND name LIKE ?";
            params.push(`%${search}%`);
        }

        // Add price range condition
        if (minPrice) {
            sqlquery += " AND price >= ?";
            params.push(minPrice);
        }
        if (maxPrice) {
            sqlquery += " AND price <= ?";
            params.push(maxPrice);
        }

        // Add sorting
        if (sort) {
            if (sort === 'name') sqlquery += " ORDER BY name ASC";
            else if (sort === 'price') sqlquery += " ORDER BY price ASC";
        }

        // Execute query
        db.query(sqlquery, params, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database query failed' });
                return next(err);
            }
            res.json(result);
        });
    });

    return router;
};
