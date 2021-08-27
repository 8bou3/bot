const { Client, Collection } = require("discord.js");
const i18n = require("i18n");

const config = require("./config.js");
const {
  loadEvents,
  loadCommands,
  i18nConfigure,
  mongooseConnect,
} = require("./functions/load");

mongooseConnect();
i18nConfigure(i18n, config);

const client = new Client(config.clientData.clientOptions);
client.login(config.clientData.token);
client.commands = new Collection();
client.cooldowns = new Collection();
client.giveaways = new Collection();

loadEvents(client);
loadCommands(client);
