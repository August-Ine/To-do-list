const express = require("express");
const ejs = require("ejs");

const app = express();

//set up view engine
app.set('view engine', 'ejs');

//handle get request to root 
app.get("/", (req, res) => {
    const date = new Date(); //new Date() object
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleString('en-US', options);

    //render ejs using formattedDate as date string
    res.render('day', { day: formattedDate });
})


//listen on port 
app.listen(3000, function () {
    console.log("server running on port 3000");
});

