//imports
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const dbmodel = require("./dbmodel.js"); //import mongoose models to use for db

const app = express();

//use body-parser as middleware to handle http request
app.use(bodyParser.urlencoded({ extended: true }));

//set up view engine
app.set('view engine', 'ejs');

//serve public static files
app.use(express.static("public"));

//establish connection to database url
async function run() {
    // connect app to db
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, dbName: "todolistDB" }); //establish connection, create db if not exist
    } catch (e) {
        console.log(e);
    }
    //var to hold list of items stored in the db
    const listOfItems = await dbmodel.Item.find({});
    //insert default values if db is empty
    if (listOfItems.length === 0) {
        try {
            await dbmodel.Item.insertMany(dbmodel.defaultItems)
        } catch (e) {
            console.log(e);
        }
    }
}
run();

//get list of items
async function getItems() {

}

//handle get request to root 
app.get("/", async (req, res) => {
    //today's date
    // const date = new Date(); //new Date() object
    // const options = { weekday: 'long', day: 'numeric', month: 'long' };
    // const formattedDate = date.toLocaleString('en-US', options);
    //read from db
    try {
        const listItems = await dbmodel.Item.find({});
        //render home ejs with list title and array
        res.render('home', { listTitle: "Today", listItems: listItems });
    } catch (e) {
        console.log(e);
    }
});
//handling route parameters
app.get("/:value", async (req, res) => {
    const customListName = _.capitalize(req.params.value);
    const listHolder = await dbmodel.Customlist.findOne({ name: customListName });
    if (listHolder) {
        //render home ejs with list title and array
        res.render('home', { listTitle: listHolder.name, listItems: listHolder.items });
    } else {
        console.log("list name doesnt exist adding to collection...");
        const newListItem = new dbmodel.Customlist({
            name: customListName,
            items: dbmodel.defaultItems
        });
        newListItem.save();
        res.redirect("/categories/" + customListName);
    }
});

app.post("/", async (req, res) => {
    //check the value of button that submitted post 
    if (req.body.addItem === "Today") {
        let newItem = req.body.newItem;
        //create model document instance
        const itemDoc = new dbmodel.Item({
            name: newItem,
        });
        //save to db
        await itemDoc.save();
        res.redirect("/");
    } else {
        //find the respective list from list title value of button
        const listName = req.body.addItem;
        const theList = await dbmodel.Customlist.findOne({
            name: listName
        });
        console.log(theList);
        //create embeddable item document
        const itemDoc = new dbmodel.Item({
            name: req.body.newItem,
        });

        //add item to the list
        theList.items.push(itemDoc);
        theList.save();

        res.redirect("/" + listName);
    }



})

//handle delete requests
app.post("/delete", async (req, res) => {
    const itemId = req.body.checkbox; //item id is stored dynamically as the value of each checkbox
    const listName = req.body.listName;//list name is stored as the value of an input 'hidden' element
    //check if checked box is from today
    if (listName === "Today") {
        try {
            await dbmodel.Item.findByIdAndRemove(itemId);
            //redirect to home 
            res.redirect("/")
        } catch (e) {
            console.log(e);
        }
    } else {
        await dbmodel.Customlist.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: itemId } } }
        );
        res.redirect("/" + listName);
    }
})

//listen on port 
app.listen(3000, function () {
    console.log("server running on port 3000");
});

