const mongoose = require("mongoose");

const professionSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Profession', professionSchema);
