const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");

if (!process.env.DBHOST) {
    throw new Error("Please specify the databse host using environment variable DBHOST.");
}

if (!process.env.DBNAME) {
    throw new Error("Please specify the name of the database using environment variable DBNAME");
}

var dict = { "container":
    [
        {name : "Agoda", url : "agoda.com"},
        {name : "Google", url : "google.com"},
        {name : "Facebook", url : "facebook.com"},
        {name : "Twitter", url : "twitter.com"},
        {name : "w3School", url : "w3schools.com"}
    ]
};


const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

//
// Connect to the database.
//
function connectDb() {
    return mongodb.MongoClient.connect(DBHOST) 
        .then(client => {
            return client.db(DBNAME);
        });
}

//
// Setup event handlers.
//
function setupHandlers(app, db) {

    //
    // HTTP GET API to retrieve list of videos from the database.
    //
    app.get("/ads", (req, res) => {
        var item = dict.container[Math.floor(Math.random()*dict.container.length)];
        res.json({item: item})
    });
}

//
// Start the HTTP server.
//
function startHttpServer(db,) {
    return new Promise(resolve => { // Wrap in a promise so we can be notified when the server has started.
        const app = express();
        app.use(bodyParser.json()); // Enable JSON body for HTTP requests.
        setupHandlers(app, db);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        app.listen(port, () => {
            resolve(); // HTTP server is listening, resolve the promise.
        });
    });
}

//
// Application entry point.
//
function main() {
    return connectDb()                      // Connect to the database...
        .then(db => {                       // then...
            return startHttpServer(db);     // start the HTTP server.
        });
}

main()
    .then(() => console.log("Microservice online."))
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });