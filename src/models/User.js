const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: Number, required: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String, required: false },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  region: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }],
  commune: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commune' }],
  network: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Network' }],
  request: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
  evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
  expertise: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expertise' }],
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }],
  profession: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profession' }],
  experience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
  institution: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution' }],
  status: { type: String, required: true },
  isExpert: { type: Boolean, required: true },
});

module.exports = mongoose.model('User', userSchema);
