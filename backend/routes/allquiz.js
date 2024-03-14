const generatePassword = require("generate-password");
const quiz = require("../models/quizzes");
const express = require("express");

const router = express.Router();

router.get("/all-quiz", async (req, res) => {
  try {
    const allQuizzes = await quiz.find();
    res.status(200).json(allQuizzes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
