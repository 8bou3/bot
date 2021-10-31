const { Client, Collection } = require("discord.js");
const config = require("./config.js");
const i18n = require("i18n");
const { i18nConfigure } = require("./functions/i18nConfigure");
const { loadEvents } = require("./functions/loadEvents");

i18nConfigure(i18n, config.locales);

const client = new Client(config.clientData.clientOptions);
client.cache = {
  guilds: new Collection(),
  cooldowns: new Collection(),
};

client.login(config.clientData.token);

loadEvents(client);
