// import Schema constructor & model function from mongoose. the Schema maps to a MongoDb collection. 
const { Schema, model } = require('mongoose');

// import dateFormat function from utils directory
const dateFormat = require('../utils/dateFormat');


// Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        // validation
        required: true,
        trim: true

    },
    createdBy: {
        type: String,
        // validation
        require: true,
        trim: true
    },
    createdAt: {
        type: Date,
        // If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp
        default: Date.now, 
        // here we use the getter `get` to retrieve the timestamp
        // everytime we retrieve a pizza, the value in createdAt field will be formatted by the dateFormat() function we imported above
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large',
        // validation
        require: true,
        enum: [ 'Personal', 'Small', 'Medium', 'Large', 'Extra-Large'],
        default: 'Large'
    },
    toppings: [], // could also specify `Array` instead of brackets
    // comments will be children of the parent model. The `ref` property will tell the Pizza model which documents to search for it's child comments
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
    {
        toJSON: {
            // here we have to tell the mongoose model to use any virtual functions we've specified 
            virtuals: true,
            // here we have to tell the mongoose model to use any getter functions we've specified 
            getters: true
        },
        id: false // mongoose returns this property by default so we set it to false

    });

// Virtual helper to get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
    // return this.comments.length;
    // Here, were're including all replies to the commentCount for each pizza.
    // The reduce() method tallies up the total of every comment with its replies. It takes 2 parameters, an `accumulator` & a `currentValue`.
    // Here, the accumulator is `total`, and the currentValue is `comment`. As it walks through the array, it passes the accumulating total and current value of the comment into the function, with the return of the function revising the total for the next iteration through the array.
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// Create the `Pizza` model by passing a string and the PizzaSchema constructor function as parameters to the model function
const Pizza = model('Pizza', PizzaSchema);

// Export the Pizza model defined above
module.exports = Pizza;