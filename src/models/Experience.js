const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  position: { type: String, required: false },
  company: { type: String, required: false },
  country: { type: String, required: false },
  since: { type: String, required: false },
  until: { type: String, required: false }
});

module.exports = mongoose.model('Experience', experienceSchema);
