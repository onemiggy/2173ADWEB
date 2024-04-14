// Import all packages installed
var Express = require('express');
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

// Create an instance of the express app
var app = Express();
app.use(cors());

// Indicate the connection string from mongodb
var CONNECTION_STRING = "mongodb+srv://juanmiggy0:20871641@cluster0.9vzprdt.mongodb.net/";

// Indicate the name of the database
var DATABASENAME = "MyDB";

// Instantiate the mongodbclient
var database;

// create a listener
app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log('Yay!');
    })
})

// get all dbase data
app.get("/api/books/GetBooks", (req, res) => {
    database.collection("books").find({}).toArray((error, result) => {
        res.send(result);
    })
})

app.post("/api/books/AddBook", multer().none(), async (req, res) => {
    try {
        const numOfDocs = await database.collection("books").countDocuments();
        await database.collection("books").insertOne({
            id: (numOfDocs + 1).toString(),
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        });
        res.json("Added Successfully");
    } catch (error) {
        console.error("Error adding book: ", error);
        res.status(500).json({ error: "Failed to add book" });
    }
});

app.delete("/api/books/DeleteBook", (req, res) => {
    database.collection("books").deleteOne({
        id: req.query.id
    });
    res.json("Deleted Successfully!");
})