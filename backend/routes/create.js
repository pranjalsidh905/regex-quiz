const generatePassword = require("generate-password");
const quiz = require("../models/quizzes");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  const questions = req.body;

  const id = generatePassword.generate({
    length: 8,
    numbers: true,
    lowercase: false,
    uppercase: false,
  });

  const password = generatePassword.generate({
    length: 8,
  });

  const quizBody = {
    id: id,
    password: password,
    questions: questions,
  };

  const newQuiz = new quiz(quizBody);

  try {
    await newQuiz.save();
    res.status(200).json({
      id: id,
      password: password,
      created: new Date().toISOString().slice(0, 10),
    });
  } catch {
    res.status(400).send("Please make sure all input fields are filled up.");
  }
});

router.get("/all", async (req, res) => {
  try {
    const allQuizzes = await quiz.find();
    res.status(200).json(allQuizzes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
