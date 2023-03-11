const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

//use body-parser as middleware to handle http request
app.use(bodyParser.urlencoded({ extended: true }));

//set up view engine
app.set('view engine', 'ejs');

//serve public static files
app.use(express.static("public"));

//array to hold list items
let listItems = [];

//handle get request to root 
app.get("/", (req, res) => {
    const date = new Date(); //new Date() object
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleString('en-US', options);

    //render ejs with date and array
    res.render('day', { day: formattedDate, listItems: listItems });
});

app.post("/", (req, res) => {
    listItems.push(req.body.newItem); //push the new item to the list array
    res.redirect("/");
})


//listen on port 
app.listen(3000, function () {
    console.log("server running on port 3000");
});

