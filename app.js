const express = require("express");
const cors = require("cors");
const app = express();

// Import Routes
const formRoute = require("./routes/form");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/form", formRoute);

module.exports = app;
