const mongoose = require("mongoose");

const expertiseSchema = new mongoose.Schema({
  area: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  name: { type: String, required: false },
  bio: { type: String, required: false }
});

module.exports = mongoose.model('Expertise', expertiseSchema);
