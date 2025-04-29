const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ResearcherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  collaborators: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['viewer', 'editor', 'admin'], default: 'viewer' }
    }
  ],
  googleId:  String,
  password: { type: String, required: true },
});

ResearcherSchema.pre('save', async function (next) {
  if (!this.avatar && this.username) {
    const seed = encodeURIComponent(this.username);
    this.avatar = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
  }

  next();
});

module.exports = mongoose.model('Researcher', ResearcherSchema);