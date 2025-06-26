const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const taskRoutes = require("./routes/taskRoutes");

const functions = require("firebase-functions");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

exports.api = functions.https.onRequest(app);
