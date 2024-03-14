// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import your User model

router.post("/admin/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    // Save the admin user to the database
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
