const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
{
    ID: {
        type: Number,
        required: true
    },

    Title: {
        type: String,
        required: true
    },

    Author: {
        type: String,
        required: true
    },

    Available: {
        type: Boolean,
        required: true
    }
},
{
    collection: "books"
});

module.exports = mongoose.model("Book", bookSchema);