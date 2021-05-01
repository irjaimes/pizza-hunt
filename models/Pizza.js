const {Schema, model } = require('mongoose');

// Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now // If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [] // could also specify `Array` instead of brackets
});

// Create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// Export the Pizza model
module.exports = Pizza;