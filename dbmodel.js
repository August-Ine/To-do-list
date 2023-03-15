//mongoose db model
const mongoose = require("mongoose");

//create item schema
const itemSchema = new mongoose.Schema({
    name: String
});
//create list schema
const customListSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

//create items model
const Item = mongoose.model("Item", itemSchema);
//create customList model
const Customlist = mongoose.model("Customlist", customListSchema)

//default documents
const defaultItems = [
    Item({ name: "Welcome to your to-do list" }),
    Item({ name: "Hit + to add item" }),
    Item({ name: "Hit the check-box to remove" })
];

module.exports = {
    Item: Item,
    Customlist: Customlist,
    defaultItems: defaultItems
}