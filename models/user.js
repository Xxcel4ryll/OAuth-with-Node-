const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  googleID: String,
});

module.exports = mongoose.model("user", userSchema);
