const guildModel = require("../../models/guild");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    let Data = new Object();

    if (message.guildId) {
      Data.guild = message.client.cache.guilds.has(message.guildId)
        ? message.client.cache.guilds.get(message.guildId)
        : await guildModel.findById(message.guildId);

      if (Data.guild?.channels.autoThreads.ids.includes(message.channelId)) {
        if (
          Data.guild.channels.autoThreads.options[
            Data.guild.channels.autoThreads.ids.indexOf(message.channelId)
          ].autoDelete
        ) {
          message.thread?.delete();
        }
      }
    }
  },
};
