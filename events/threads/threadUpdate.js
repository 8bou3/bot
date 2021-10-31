const i18n = require("i18n");
const guildModel = require("../../models/guild");

module.exports = {
  name: "threadUpdate",
  async execute(oldThread, newThread, client) {
    let Data = new Object();

    Data.guild = client.cache.guilds.has(newThread.guildId)
      ? client.cache.guilds.get(newThread.guildId)
      : (Data.guild = await guildModel.findById(newThread.guildId));

    if (!Data.guild) return;

    if (!newThread.archived && oldThread.archived)
      if (Data.guild.channels.autoThreads.ids.includes(newThread.parentId)) {
        let autoArchiveDuration =
          Data.guild.channels.autoThreads.options[
            Data.guild.channels.autoThreads.ids.indexOf(newThread.parentId)
          ].autoArchiveDuration;
        autoArchiveDuration === 1
          ? newThread.setArchived(true)
          : newThread.setAutoArchiveDuration(autoArchiveDuration);
      }
  },
};
