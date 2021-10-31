const { Client, Collection } = require("discord.js");
const config = require("./config.js");

const { loadEvents } = require("./functions/loadEvents");

const client = new Client(config.clientData.clientOptions);
client.cache = {
  guilds: new Collection(),
  cooldowns: new Collection(),
};

client.login(config.clientData.token);

loadEvents(client);
