// This file imports all of the API routes to prefix their endpoint names and package them up.

const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');
const commentRoutes = require('./comment-routes');

// add prefix of `/pizza` to routes created in `pizza-routes.js`
router.use('/pizzas', pizzaRoutes);

// add prefix of `/comments` 
router.use('/comments', commentRoutes);

module.exports = router;