// This file imports all of the API routes to prefix their endpoint names and package them up.

const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');

// add prefix of `/pizza` to routes created in `pizza-routes.js`
router.use('/pizzas', pizzaRoutes);

module.exports = router;