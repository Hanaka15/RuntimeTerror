const mongoose = require("mongoose");

const StudyResearcherSchema = new mongoose.Schema({
  researcherId: { type: String, required: true },
  workspaceId: { type: String, required: true },
  permission: { type: String, enum: ["read", "write", "admin"], required: true }
}, { _id: false });

const StudyResearcher = mongoose.model("WorkspaceResearcher", StudyResearcherSchema);

module.exports = StudyResearcher;

