//mongoose db model
const mongoose = require("mongoose");

//create item schema
const itemSchema = new mongoose.Schema({
    name: String
});

//create model
const Item = mongoose.model("Item", itemSchema);

//documents for testing
const tasks = [
    Item({ name: "Wake up" }),
    Item({ name: "Brush teeth" }),
    Item({ name: "Walk the dog" })
];

module.exports = {
    Item: Item,
    tasks: tasks
}