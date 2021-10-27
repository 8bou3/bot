const guildModel = require("../../models/guild");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;
    let Data = new Object();

    if (message.guildId) {
      Data.guild = message.client.cache.guilds.has(message.guildId)
        ? message.client.cache.guilds.get(message.guildId)
        : await guildModel.findById(message.guildId);

      if (Data.guild?.channels.autoCrosspost.includes(message.channelId)) {
        if (message.crosspostable) message.crosspost();
      }
      if (Data.guild?.channels.autoThreads.ids.includes(message.channelId)) {
        Data.options =
          Data.guild.channels.autoThreads.options[
            Data.guild.channels.autoThreads.ids.indexOf(message.channelId)
          ];
        if (
          message.channel
            .permissionsFor(message.client.user.id)
            .has("MANAGE_THREADS") &&
          !message.hasThread &&
          Data.options
        ) {
          message
            .startThread({
              name: `${Data.options.names} {${message.content.slice(0, 14)}}`,
              autoArchiveDuration:
                Data.options.autoArchiveDuration > 1
                  ? Data.options.autoArchiveDuration
                  : undefined,
              reason: "Auto Threads",
            })
            .then((thread) =>
              Data.options.autoArchiveDuration === 1
                ? thread.setArchived(true)
                : undefined
            );
        }
      }
    }
  },
};
