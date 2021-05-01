// Import models directory to access models
const { Pizza } = require('../models');


// create the pizzaController object and its methods(functions)
// these methods will be used as the callback functions for the Express.js routes
const pizzaController = {

    // get ALL pizzas
    getAllPizza(req, res){
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get ONE pizza by ID
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id }) // Instead of accessing the entire `req` object, we've destructured `params` out of it, because that's the only data we need for this request to be fulfilled. 
        .then(dbPizzaData => {
            // id no pizza is found, 404 error
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            // otherwise return response as json
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create pizza
    createPizza({ body }, res) { // here destructure the `body` out of the Express.js `req` object because we don't need to interface with any of the other data it provides.
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },
    
    // update pizza by id
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true }) // the 3rd parameter returns the new version of the document
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete pizza by id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }

};

module.exports = pizzaController;