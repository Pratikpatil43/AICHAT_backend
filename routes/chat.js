const express = require("express");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const User = require("../models/User");

const router = express.Router();


require("dotenv").config();

// Initialize OpenAI
const openai = new OpenAI({
  APIKEY: process.env.OPENAI_API_KEY, // Make sure .env contains this
});

// Middleware to Authenticate User
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid", error: error.message });
  }
};

// AI Chat Route
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const { gender, chatPreference } = req.user;

    // Check if message is off-topic
    const blockedKeywords = ["math", "science", "Python", "history", "capital", "programming"];
    if (blockedKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return res.json({ ai: "Hey babe, I’m only here for love, not homework! 😉" });
    }

    // AI Prompt
    const prompt = `
      You are a virtual ${gender === "male" ? "girlfriend" : "boyfriend"} for the user.
      Your chat style is: ${chatPreference} (funny, flirty, or romantic).
      Do not answer technical questions.
      User: ${message}
      AI: 
    `;

    // OpenAI API Call
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ ai: response.choices[0].message.content });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
