require("dotenv").config();

const express = require("express");
const exphbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const randomstring = require("randomstring");
const mongoose = require("mongoose");

const Book = require("./models/Book");
const Client = require("./models/Client");

const app = express();   
const PORT = 3000;

const bookRoutes = require("./routes/bookRouter");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.log("MongoDB Error:", err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session 3 mins
app.use(session({
    secret: randomstring.generate(),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3 * 60 * 1000 }
}));

// Book routes
app.use("/", bookRoutes);

// Handlebars
app.engine("hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));

app.set("view engine", "hbs");

// Users
const usersPath = path.join(__dirname, "users.json");

const users = JSON.parse(
    fs.readFileSync(usersPath, "utf8")
);

// Landing page
app.get("/", (req, res) => {
    res.render("landing");
});

// Sign in page
app.get("/signin", (req, res) => {
    res.render("signin", {
        error: ""
    });
});

// Login
app.post("/signin", (req, res) => {

    const { username, password } = req.body;


    if (!users[username]) {
        return res.render("signin", {
            error: "Not a registered username"
        });
    }


    if (users[username] !== password) {
        return res.render("signin", {
            error: "Invalid password"
        });
    }


    req.session.user = username;

    res.redirect("/home");
});


// Protect pages
function requireLogin(req, res, next) {

    if (!req.session.user) {
        return res.redirect("/");
    }

    next();
}

// HOME
app.get("/home", requireLogin, async (req, res) => {

    try {

        const books = await Book.find().lean();

        const client = await Client.findOne({
            Username: req.session.user
        });

        const borrowedIDs = client
            ? client.IDBooksBorrowed.map(Number)
            : [];

        const availableBooks = books.filter(
            book => book.Available === true
        );

        const borrowedBooks = books.filter(
            book => borrowedIDs.includes(Number(book.ID))
        );

        res.render("home", {
            user: req.session.user,
            availableBooks,
            borrowedBooks
        });

    } catch(error) {

        console.log(error);
        res.send("Database error");

    }

});

// Test MongoDB books
app.get("/testbooks", async (req, res) => {

    const books = await Book.find().lean();

    res.json(books);

});

// Sign out
app.get("/signout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});