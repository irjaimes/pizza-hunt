// variable to hold coneected database object when connection is complete
let db;

// request variable acts as an event listenerfor the database
// it establishes connection to IndexedDB database called `pizza_hunt` and sets it to version 1
const request = indexedDB.open('pizza_hunt', 1);
// indexedDB is part of the browser's window object. It's a global variable so no need to call window.indexedDB.
// the .open method takes two parametes: 
// 1. the named of the IndexedDB database you want to create, or connect to if it exists already
// 2. the version of the database. By deafault, we start at 1. It's used to determine whether the database's structure has changed, similar to changing  columns in sql databases. 

// indexedDB does NOT hold data. in mongoDB collections hold the data, much like tables hold data in sql.
// the indexedDB data container is called an object store. It cannot be created until connectio to the database is open

// this event will emit if the database version changes(nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have auto incrementing key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
}
// event will emit the first time we run this code and create the new_pizza object store. 
// The event won't run again unless we delete the database from the browser or we change the version number in the .open() method to a value of 2, indicating that our database needs an update.
// When this event executes, we store a locally scoped connection to the database and use the .createObjectStore() method to create the object store that will hold the pizza data. 
// With IndexedDB, we have a veritable blank slate—we'll have to establish all of the rules for working with the database.
// For that reason, when we create the new_pizza object store, we also instruct that store to have an auto incrementing index for each new set of data we insert. Otherwise we'd have a hard time retrieving data.

// upon a successful 
request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};


// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
}

// function to upload pizzas stored in IndexedDB to the server once we regain connection to internet
function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server endpoint 
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);