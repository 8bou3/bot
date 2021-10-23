const i18n = require("i18n");

module.exports = {
  name: "threadCreate",
  async execute(thread, client) {
    let Data = new Object();

    Data.guild = client.cache.guilds.has(interaction.guildId)
      ? client.cache.guilds.get(interaction.guildId)
      : (Data.guild = await guildModel.findOne({
          _id: interaction.guildId,
        }));

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
