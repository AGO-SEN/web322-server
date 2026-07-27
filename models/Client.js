const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
{
    Username: {
        type: String,
        required: true
    },

    IDBooksBorrowed: {
        type: [Number],
        default: []
    }
},
{
    collection: "clients"
});

module.exports = mongoose.model("Client", clientSchema);