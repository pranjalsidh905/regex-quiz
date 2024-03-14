const Quiz = require("../models/quizzes");
const express = require("express");
const User = require("../models/User");

const router = express.Router();
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
    const quiz = await Quiz.findById(quizId);
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
    const existingQuizScore = user.quizScores.find(
      (quizScore) =>
        quizScore?.quizId && quizScore.quizId.toString() === quizId.toString()
    );

    console.log(quizId);
    // console.log(user);
    if (existingQuizScore) {
      console.log("Error: Marks already saved for this quiz");
      return res
        .status(400)
        .json({ error: "Marks already saved for this quiz" });
    }

    // Add new quiz score
    user.quizScores.push({ quizId, score });
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
