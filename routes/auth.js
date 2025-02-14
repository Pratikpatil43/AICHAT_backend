const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, chatPreference } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hashedPassword, gender, chatPreference });

    // Save user to database
    await user.save(); // Ensure user is saved first

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send response
    res.status(201).json({ msg: "User registered successfully", token, user });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});



// Login User
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({ token, user });

//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

module.exports = router;
