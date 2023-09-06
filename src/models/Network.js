const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema({
  linkedin: { type: String, required: false },
  twitter: { type: String, required: false },
  instagram: { type: String, required: false },
  medium: { type: String, required: false }
});

module.exports = mongoose.model('Network', networkSchema);
