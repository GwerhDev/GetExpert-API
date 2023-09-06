const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Institution', institutionSchema);
