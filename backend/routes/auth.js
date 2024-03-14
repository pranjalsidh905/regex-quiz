const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const secretKey = process.env.JWT_SECRET || "fallbackSecretKey";
// const { authenticateToken } = require("../Middleware/authMiddleware");

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use the same salt rounds

    console.log("Hashed Password during Registration:", hashedPassword);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Invalid input. Please check your data." });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user or admin user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove sensitive information from the user object
    const userWithoutPassword = { ...user._doc, password: undefined };

    // Generate and send a JWT token upon successful login
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      "Pranjalsidh123",
      { expiresIn: "7d" }
    );

    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
  router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// router.get("/profile", authenticateToken, (req, res) => {
//   // Access user information from req.user
//   res.json({ user: req.user });
// });

module.exports = router;
