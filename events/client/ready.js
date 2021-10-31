const { loadCommands } = require("../../functions/loadCommands");
const { loadButtons } = require("../../functions/loadButtons");
const { loadSelectMenus } = require("../../functions/loadSelectMenus");
const { mongooseConnect } = require("../../functions/mongooseConnect");

const config = require("../../config.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.cache.console = client.channels.cache.get("904100576894283806");
    client.cache.errors = client.channels.cache.get("904375875565420544");

    if (client.cache.console) {
      console.log = (d) => client.cache.console.send(d.toString());
    }
    if (client.cache.errors) {
      console.error = (d) => client.cache.console.send(d.toString());
    }

    console.log("==========================================");
    console.log(`client.cache.console: ${client.cache.console}`);
    console.log(`client.cache.errors: ${client.cache.errors}`);
    console.log(`client.cache.guilds: ${client.cache.guilds.size}`);
    console.log(`client.cache.cooldowns: ${client.cache.cooldowns.size}`);

    mongooseConnect(config.mongoPath);
    loadCommands(client);
    loadButtons(client);
    loadSelectMenus(client);
  },
};
