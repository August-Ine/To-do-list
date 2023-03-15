//imports
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const dbmodel = require("./dbmodel.js"); //import mongoose models to use for db

const app = express();

//use body-parser as middleware to handle http request
app.use(bodyParser.urlencoded({ extended: true }));

//set up view engine
app.set('view engine', 'ejs');

//serve public static files
app.use(express.static("public"));

//list of items
let itemList = [];


//establish connection to database url
async function run() {
    // connect app to db
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, dbName: "listitems" }); //establish connection, create db if not exist
    } catch (e) {
        console.log(e);
    }
}
run();
//get list of items
async function getItems() {

}

//handle get request to root 
app.get("/", async (req, res) => {
    //today's date
    const date = new Date(); //new Date() object
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleString('en-US', options);
    //read from db
    try {
        const listItems = await dbmodel.Item.find({});
        //render ejs with date and array
        res.render('home', { day: formattedDate, listItems: listItems });
    } catch (e) {
        console.log(e);
    }
});

app.post("/", (req, res) => {
    let newItem = req.body.newItem;
    //create model document instance
    const itemDoc = new dbmodel.Item({
        name: newItem,
    });
    //save to db
    itemDoc.save();
    res.redirect("/");
})

//handle delete requests
app.post("/delete", async (req, res) => {
    itemId = req.body.checkbox; //item id is stored dynamically as the value of each checkbox
    //each button has name="checkbox" hence body.checkbox
    //delete entry in db
    try {
        const listItems = await dbmodel.Item.findByIdAndRemove(itemId);
        //redirect to home 
        res.redirect("/")
    } catch (e) {
        console.log(e);
    }
})

//listen on port 
app.listen(3000, function () {
    console.log("server running on port 3000");
});

