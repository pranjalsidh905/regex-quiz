const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// Environment variables
const DB_URI = process.env.DB_URI;
const PORT = 5000;

// Initialize express
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
const createRoute = require("./routes/create");
const quizRoute = require("./routes/quiz");
const authRoutes = require("./routes/auth");
const csvRoutes = require("./routes/csv");
const adminRoutes = require("./routes/adminRoutes");
const allquiz = require("./routes/allquiz");
const result = require("./routes/result");
app.use("/create", createRoute);
app.use("/allquiz", allquiz);
app.use("/quiz", quizRoute);
app.use("/auth", authRoutes);
app.use("/csv", csvRoutes);
app.use("/api", adminRoutes);
app.use("/result", result);
// Start the server
mongoose
  .connect(
    "mongodb+srv://sidhpranjal905:fGCA8Vx5Mhs1XJiw@pranjal.xpskej1.mongodb.net/Quizze?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on PORT " + PORT);
    });
  });
