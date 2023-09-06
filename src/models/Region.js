const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  name: { type: String, required: false },
  code: { type: String, required: false },
  commune: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commune' }]
});

module.exports = mongoose.model('Region', regionSchema);
