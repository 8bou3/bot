const i18n = require("i18n");
const guildModel = require("../../models/guild");

module.exports = {
  name: "threadCreate",
  async execute(thread, client) {
    let Data = new Object();

    Data.guild = client.cache.guilds.has(thread.guildId)
      ? client.cache.guilds.get(thread.guildId)
      : (Data.guild = await guildModel.findById(thread.guildId));

    if (!Data.guild) return;

    if (Data.guild.channels.slowmode.ids.includes(thread.parentId)) {
      let timeout =
        Data.guild.channels.slowmode.options[
          Data.guild.channels.slowmode.ids.indexOf(thread.parentId)
        ].timeout;
      if (timeout === 0) timeout = thread.parent.rateLimitPerUser;
      thread.setRateLimitPerUser(
        timeout,
        i18n.__("threads.autoRateLimitPerUserReason")
      );
    }

    if (Data.guild.channels.autoThreads.ids.includes(thread.parentId))
      Data.guild.channels.autoThreads.options[
        Data.guild.channels.autoThreads.ids.indexOf(thread.parentId)
      ].autoArchiveDuration === 1
        ? thread.setArchived(true)
        : undefined;
  },
};
