const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  chatPreference: { type: String, enum: ["funny", "flirty", "romantic"], default: "funny" }
});

module.exports = mongoose.model("User", UserSchema);
