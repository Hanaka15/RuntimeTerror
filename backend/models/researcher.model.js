const mongoose = require('mongoose');

const ResearcherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  googleId:  String,
  password: { type: String, required: true },
});

module.exports = mongoose.model('Researcher', ResearcherSchema);