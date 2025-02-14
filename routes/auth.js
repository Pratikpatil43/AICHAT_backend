const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, gender, chatPreference } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = new User({ name, email, password: hashedPassword, gender, chatPreference });

//     // Save user to database
//     await user.save(); // Ensure user is saved first

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     // Send response
//     res.status(201).json({ msg: "User registered successfully", token, user });

//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });



// Login User
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Please provide username and password" });
    }

    // Check if user exists
    let user = await User.findOne({ username });

    if (!user) {
      // If user does not exist, create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, password: hashedPassword });

      await user.save();
    } else {
      // If user exists, check the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ msg: "Login successful", token, user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
