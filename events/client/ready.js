const { loadCommands } = require("../../functions/loadCommands");
const { loadButtons } = require("../../functions/loadButtons");
const { loadSelectMenus } = require("../../functions/loadSelectMenus");
const { connect } = require("mongoose");

const config = require("../../config.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    connect(config.mongoPath)
      .then(() => {
        loadCommands(client);
        loadButtons(client);
        loadSelectMenus(client);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
