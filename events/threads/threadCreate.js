const i18n = require("i18n");

const channelModel = require("../../models/channel");

module.exports = {
  name: "threadCreate",
  async execute(thread, client) {
    let channelData = await channelModel.findOne({
      channelId: thread.parentID,
    });
    if (!channelData) {
      channelData = new channelModel({
        channelId: thread.parentID,
        guildId: thread.guild.id,
      }); //Create new channel data if none
      await channelData.save(); //Save the created channel data
    }

    if (channelData.threads.syncSlowmode && thread.parent.rateLimitPerUser)
      thread.setRateLimitPerUser(
        thread.parent.rateLimitPerUser,
        i18n.__("threads.syncRateLimitPerUserReason")
      ); //Set slowmode
  },
};
