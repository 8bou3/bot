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

    if (
      Data.guild.channels.syncSlowmode.includes(thread.parentId) &&
      thread.parent.rateLimitPerUser
    )
      thread.setRateLimitPerUser(
        thread.parent.rateLimitPerUser,
        i18n.__("threads.syncRateLimitPerUserReason")
      );
  },
};
