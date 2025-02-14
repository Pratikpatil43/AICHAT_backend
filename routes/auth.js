const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, chatPreference } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, gender, chatPreference });
     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user });
    
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
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
