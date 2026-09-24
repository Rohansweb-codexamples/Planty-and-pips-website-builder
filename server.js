const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DATA_DIR = path.join(__dirname, "sites");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

function createId() {
    return "g_" + Math.random().toString(36).substring(2, 12);
}

app.get("/", (req, res) => {
    res.send("Planty & Pips Publish Server Running");
});

app.post("/publish", (req, res) => {

    const html = req.body.html;

    if (!html) {
        return res.status(400).json({
            success: false,
            error: "No HTML supplied"
        });
    }

    const siteId = createId();

    fs.writeFileSync(
        path.join(DATA_DIR, siteId + ".html"),
        html,
        "utf8"
    );

    res.json({
        success: true,
        siteId,
        url: `https://projects.rohansweb.co.uk/Sites?siteId=${siteId}`
    });

});

app.get("/site/:siteId", (req, res) => {

    const file = path.join(
        DATA_DIR,
        req.params.siteId + ".html"
    );

    if (!fs.existsSync(file)) {
        return res.status(404).json({
            success: false,
            error: "Site not found"
        });
    }

    res.sendFile(file);

});

app.get("/api/site/:siteId", (req, res) => {

    const file = path.join(
        DATA_DIR,
        req.params.siteId + ".html"
    );

    if (!fs.existsSync(file)) {
        return res.status(404).json({
            success: false
        });
    }

    res.json({
        success: true,
        html: fs.readFileSync(file, "utf8")
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        "Planty & Pips server running on port",
        PORT
    );
});
