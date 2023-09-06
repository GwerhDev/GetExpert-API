const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  idExpert: { type: String, required: true },
  idRequester: { type: String, required: true },
  media: { type: String, required: true },
  format: { type: String, required: true },
  dayDate: { type: Date, required: true },
  hourDate: { type: String, required: true },
  info: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('Request', requestSchema);