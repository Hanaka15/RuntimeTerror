const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db"); // Import the existing DB connection

// Import models
const Researcher = require("./researcher.model")(sequelize, DataTypes);
const Participant = require("./participant.model")(sequelize, DataTypes);
const Workspace = require("./workspace.model")(sequelize, DataTypes);
const Study = require("./study.model")(sequelize, DataTypes);
const Question = require("./question.model")(sequelize, DataTypes);
const Answer = require("./answer.model")(sequelize, DataTypes);
const Stimulus = require("./stimulus.model")(sequelize, DataTypes);
const WorkspaceResearcher = require("./workspace-researcher.model")(sequelize, DataTypes);
const Token = require("./token.model")(sequelize, DataTypes);


// Store models in an object for easy access
const models = {
  Researcher,
  Participant,
  Workspace,
  Study,
  Question,
  Answer,
  Stimulus,
  WorkspaceResearcher,
  Token, 
};

// Setup model associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Sync successful");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

// Export models and sync function
module.exports = { ...models, sequelize, syncDB };
