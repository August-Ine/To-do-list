const express = require("express");
const ejs = require("ejs");

const app = express();

//set up view engine
app.set('view engine', 'ejs');

//handle get request to root 
app.get("/", (req, res) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date(); //create Date() object
    const dayOfWeek = daysOfWeek[today.getDay()];//getDay() returns index 0 to 6
    console.log(dayOfWeek);

    //log day of the week and render ejs template passing dayofWeek as variable
    res.render('day', { day: dayOfWeek });
})


//listen on port 
app.listen(3000, function () {
    console.log("server running on port 3000");
});

