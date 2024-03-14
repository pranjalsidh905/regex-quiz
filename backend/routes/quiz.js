const express = require("express");
const quiz = require("../models/quizzes");
const User = require("../models/User");

const router = express.Router();

// router.use(async (req, res, next) => {
//   const credentials = req.body;
//   const quizData = await quiz.findOne({ id: credentials.id });
//   if (quizData) {
//     if (quizData.password === credentials.password) {
//       req.credentials = credentials;
//       req.questions = quizData.questions;
//       next();
//     } else {
//       res.status(400).send("Invalid Password");
//     }
//   } else {
//     res.status(400).send("Invalid ID");
//   }
// });

router.use(async (req, res, next) => {
  const credentials = req.body;
  try {
    // Use a different variable name for the local scope
    const foundQuiz = await quiz.findOne({ id: credentials.id });

    if (foundQuiz) {
      if (foundQuiz.password === credentials.password) {
        req.credentials = credentials;
        req.questions = foundQuiz.questions;
        next();
      } else {
        res.status(400).send("Invalid Password");
      }
    } else {
      res.status(400).send("Invalid ID");
    }
  } catch (error) {
    console.error("Error during quiz validation:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

router.post("/credentials", async (req, res) => {
  res.status(200).json(req.credentials);
});

router.post("/questions", async (req, res) => {
  res.status(200).json(req.questions);
});

router.post("/quiz-results", async (req, res) => {
  try {
    const { userId, quizId, score } = req.body;

    console.log("Received request to save quiz result:");
    console.log("userId:", userId);
    console.log("quizId:", quizId);
    console.log("score:", score);

    // Check if userId, quizId, and score are provided
    if (!userId || !quizId || !score) {
      console.log("Error: userId, quizId, and score are required");
      return res
        .status(400)
        .json({ error: "userId, quizId, and score are required" });
    }

    // Check if the provided quizId corresponds to an existing quiz
    const quiz = await quiz.findById(quizId);
    if (!quiz) {
      console.log("Error: Quiz not found");
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Check if the provided userId corresponds to an existing user
    const user = await User.findById(userId);
    if (!user) {
      console.log("Error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the quiz score in user's quizScores array
    const existingQuizScoreIndex = user.quizScores.findIndex(
      (quizScore) => quizScore.quizId.toString() === quizId.toString()
    );
    if (existingQuizScoreIndex !== -1) {
      // Update existing quiz score
      user.quizScores[existingQuizScoreIndex].score = score;
    } else {
      // Add new quiz score
      user.quizScores.push({ quizId, score });
    }

    // Save updated user
    await user.save();

    console.log("Quiz result saved successfully");
    res.status(201).json({ message: "Quiz result saved successfully" });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

module.exports = router;
