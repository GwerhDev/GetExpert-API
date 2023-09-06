const mongoose = require("mongoose");

const communeSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Commune', communeSchema);