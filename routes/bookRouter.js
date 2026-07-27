const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const Client = require("../models/Client");


// BORROW
router.post("/borrow", async (req, res) => {

    let selected = req.body.books;

    if (!selected) {
        return res.redirect("/home");
    }

    if (!Array.isArray(selected)) {
        selected = [selected];
    }


    const client = await Client.findOne({
        Username: req.session.user
    });


    const books = await Book.find({
        Title: {
            $in: selected
        },
        Available: true
    });


    const bookIDs = books.map(
        book => book.ID
    );


    await Book.updateMany(
        {
            ID: {
                $in: bookIDs
            }
        },
        {
            $set: {
                Available: false
            }
        }
    );


    if (client) {

        client.IDBooksBorrowed.push(...bookIDs);

        await client.save();

    }


    res.redirect("/home");

});


// RETURN
router.post("/return", async (req, res) => {

    let selected = req.body.books;


    if (!selected) {
        return res.redirect("/home");
    }


    if (!Array.isArray(selected)) {
        selected = [selected];
    }


    const client = await Client.findOne({
        Username: req.session.user
    });


    const books = await Book.find({
        Title: {
            $in: selected
        }
    });


    const bookIDs = books.map(
        book => book.ID
    );


    await Book.updateMany(
        {
            ID: {
                $in: bookIDs
            }
        },
        {
            $set: {
                Available: true
            }
        }
    );


    if (client) {

        client.IDBooksBorrowed =
            client.IDBooksBorrowed.filter(
                id => !bookIDs.includes(id)
            );

        await client.save();

    }


    res.redirect("/home");

});


module.exports = router;