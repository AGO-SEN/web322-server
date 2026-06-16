const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    const nowGMT = new Date().toISOString();

    const yourName = "Anson Go"; 

    res.send(`<h1>${yourName} WEB322 ${nowGMT}</h1>`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});