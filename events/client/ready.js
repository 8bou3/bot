const { loadCommands } = require("../../functions/loadCommands");
const { loadButtons } = require("../../functions/loadButtons");
const { loadSelectMenus } = require("../../functions/loadSelectMenus");
const { mongooseConnect } = require("../../functions/mongooseConnect");

const config = require("../../config.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    mongooseConnect(config.mongoPath);
    loadCommands(client);
    loadButtons(client);
    loadSelectMenus(client);
  },
};
