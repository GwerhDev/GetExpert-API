const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Company', companySchema);
