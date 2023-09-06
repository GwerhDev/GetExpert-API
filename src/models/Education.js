const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  career: { type: String, required: false },
  institution: { type: String, required: false },
  country: { type: String, required: false },
  since: { type: String, required: false },
  until: { type: String, required: false }
});

module.exports = mongoose.model('Education', educationSchema);
