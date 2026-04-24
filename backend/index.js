const express = require("express");
const dotenv = require("dotenv");

dotenv.config(); // .env file read karega

const app = express();

// Middleware
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Port from .env
const PORT = process.env.PORT || 9000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});