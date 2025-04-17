const mongoose = require('mongoose');

const ResearcherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  googleId:  String,
  password: { type: String, required: true },
});

ResearcherSchema.pre('save', function (next) {
  if (!this.avatar && this.username) {
    const seed = encodeURIComponent(this.username);
    this.avatar = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
  }
  next();
});

module.exports = mongoose.model('Researcher', ResearcherSchema);