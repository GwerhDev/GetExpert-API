const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Area', areaSchema);
