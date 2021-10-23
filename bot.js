const { Client, Collection } = require("discord.js");
const i18n = require("i18n");

const config = require("./config.js");

const { loadEvents } = require("./functions/loadEvents");
const { loadCommands } = require("./functions/loadCommands");
const { loadButtons } = require("./functions/loadButtons");
const { loadSelectMenus } = require("./functions/loadSelectMenus");
const { i18nConfigure } = require("./functions/i18nConfigure");
const { mongooseConnect } = require("./functions/mongooseConnect");

mongooseConnect(config.mongoPath);
i18nConfigure(i18n, config.locales);

const client = new Client(config.clientData.clientOptions);
client.cache = {
  guilds: new Collection(),
  cooldowns: new Collection(),
};

client.login(config.clientData.token);

loadEvents(client);
loadCommands(client);
loadButtons(client);
loadSelectMenus(client);
