const { loadCommands } = require("../../functions/loadCommands");
const { loadButtons } = require("../../functions/loadButtons");
const { loadSelectMenus } = require("../../functions/loadSelectMenus");
const { i18nConfigure } = require("../../functions/i18nConfigure");
const { mongooseConnect } = require("../../functions/mongooseConnect");

const config = require("../../config.js");
const i18n = require("i18n");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.channels.cache.get("844694156844859392")?.send("**ready**");
    client.channels.cache.get("859957382435176519")?.send("**ready**");

    client.cache.console = client.channels.cache.get("904100576894283806");
    if (client.cache.console) {
      console.log = (d) => client.cache.console.send(d.toString());
    }

    console.log("==========================================");
    console.log(`client.cache.console: ${client.cache.console}`);
    console.log(`client.cache.guilds: ${client.cache.guilds.size}`);
    console.log(`client.cache.cooldowns: ${client.cache.cooldowns.size}`);

    mongooseConnect(config.mongoPath);
    i18nConfigure(i18n, config.locales);
    loadCommands(client);
    loadButtons(client);
    loadSelectMenus(client);
  },
};
