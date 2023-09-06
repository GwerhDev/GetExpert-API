const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Media', mediaSchema);
