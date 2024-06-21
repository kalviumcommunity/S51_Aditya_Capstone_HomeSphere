const mongoose = require('mongoose');

// Define the block schema
const blockSchema = new mongoose.Schema({
    units: { type: Number, required: true },
    location: { type: String, required: true },
    specificity: { type: String }
});

// Define the item schema with blocks as an array of blockSchema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    units: { type: Number }, // Note: Match this to what you're capturing in the form
    date: {
        boughtDate: { type: Date },
        expiriyDate: { type: Date },
        guarantee: { type: String }
    },
    image: { type: String, required: true }, // Assuming this is the file path or URL
    productLink: { type: String },
    blocks: [blockSchema]
});

// Create the Item model
const Item = mongoose.model("Item", itemSchema); // Use a more descriptive model name

module.exports = Item;
