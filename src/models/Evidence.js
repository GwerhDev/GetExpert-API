const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
  photo: { type: String, required: false },
  type: { type: String, required: false },
  media: { type: String, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  url: { type: String, required: false }
});

module.exports = mongoose.model('Evidence', evidenceSchema);
