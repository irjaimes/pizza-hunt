// Import models directory to access models
const { Pizza } = require('../models');


// create the pizzaController object and its methods(functions)
// these methods will be used as the callback functions for the Express.js routes
const pizzaController = {

    // get ALL pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({  // this populates any comments attached to parent pizza 
                path: 'comments',
                select: '-__v'  // this select and the - sign tells mongoose that we dont care about this default property to be returned
            })
            .select('-__v')  // removes this default property when data is returned
            .sort({ _id: -1 })  // this method sorts the get query so that the newest pizza returns first
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get ONE pizza by ID
    // Instead of passing `req` as parameter, we destructure it to get `params` so we dont get the whole req body.
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id }) // Instead of accessing the entire `req` object, we've destructured `params` out of it, because that's the only data we need for this request to be fulfilled. 
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            // .sort({ _id: -1 }) ** Dont need sort here because we're looking at single pizza by id
            .then(dbPizzaData => {
                // if no pizza id is found, 404 error
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
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
        // the 3rd parameter returns the new version of the document. `runValidators: true` can added to `new:` so validators are ran
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true }) 
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
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
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }

};

module.exports = pizzaController;