const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const jwt = require("jsonwebtoken");
const quiz = require("../models/quizzes");

const crypto = require("crypto");
const generatePassword = require("generate-password");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "Pranjalsidh123");
    console.log("Decoded Token:", decoded);

    if (!decoded || typeof decoded.isAdmin === "undefined") {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid token", error: error.message });
  }
};

router.post("/upload-csv", isAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const bufferString = req.file.buffer.toString("utf-8");
    const csvData = [];

    const parser = csvParser();

    parser.on("data", (data) => {
      csvData.push(data);
    });

    parser.on("end", async () => {
      try {
        const transformedData = csvData.map((csvRow) => {
          const id = parseInt(csvRow.id);
          const correctAnswer = parseInt(csvRow.correctAnswer);

          if (isNaN(id) || isNaN(correctAnswer)) {
            throw new Error("Invalid id or correctAnswer value in CSV");
          }

          return {
            id,
            questionText: csvRow.questionText,
            answers: [
              csvRow.answer1,
              csvRow.answer2,
              csvRow.answer3,
              csvRow.answer4,
            ],
            correctAnswer,
          };
        });

        // Generate a unique ID and password for the quiz
        const quizId = generatePassword.generate({
          length: 8,
          numbers: true,
          lowercase: false,
          uppercase: false,
        });

        const quizPassword = generatePassword.generate({
          length: 8,
        });

        // Create a quiz instance using Mongoose model
        const quizInstance = new quiz({
          id: quizId,
          password: quizPassword,
          questions: transformedData,
        });

        // Save the quiz instance to MongoDB
        await quizInstance.save();

        console.log("CSV data saved to MongoDB:", transformedData);
        res.status(200).json({
          id: quizId,
          password: quizPassword,
          created: new Date().toISOString().slice(0, 10),
        });
      } catch (error) {
        console.error("Error saving CSV data to MongoDB:", error);
        res.status(500).send("Error saving CSV data to MongoDB.");
      }
    });

    parser.write(bufferString);
    parser.end();
  } catch (error) {
    console.error("Error processing CSV:", error);
    res.status(500).send("Internal Server Error");
  }
});

// router.post("/upload-csv", isAdmin, upload.single("file"), async (req, res) => {
//   console.log(req.body);
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const bufferString = req.file.buffer.toString("utf-8");
//     const csvData = [];

//     const parser = csvParser();

//     parser.on("data", (data) => {
//       csvData.push(data);
//     });

//     parser.on("end", async () => {
//       try {
//         const transformedData = csvData.map((csvRow) => {
//           const id = parseInt(csvRow.id);
//           const correctAnswer = parseInt(csvRow.correctAnswer);

//           // Validate if id and correctAnswer are valid numbers
//           if (isNaN(id) || isNaN(correctAnswer)) {
//             throw new Error("Invalid id or correctAnswer value in CSV");
//           }

//           return {
//             id,
//             questionText: csvRow.questionText, // Make sure 'questionText' is present
//             answers: [
//               csvRow.answer1,
//               csvRow.answer2,
//               csvRow.answer3,
//               csvRow.answer4,
//             ],
//             correctAnswer,
//           };
//         });

//         // Save transformed data to MongoDB using Mongoose
//         const quizInstance = new quiz({
//           id: "yourQuizId", // Provide a unique ID for your quiz
//           password: "yourQuizPassword", // Provide a password for your quiz
//           questions: transformedData,
//         });

//         await quizInstance.save();

//         console.log("CSV data saved to MongoDB:", transformedData);
//         res.status(200).send("CSV file uploaded and processed successfully.");
//       } catch (error) {
//         console.error("Error saving CSV data to MongoDB:", error);
//         res.status(500).send("Error saving CSV data to MongoDB.");
//       }
//     });

//     parser.write(bufferString);
//     parser.end(); // End the parsing process
//   } catch (error) {
//     console.error("Error processing CSV:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
