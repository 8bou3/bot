const i18n = require("i18n");

const channelModel = require("../../models/channel");

module.exports = {
  name: "threadCreate",
  async execute(thread, client) {
    let Data = new Object
    Data.channel = await channelModel.findOne({
      channelId: thread.parentID,
    });
    if (!Data.channel) {
      Data.channel = new channelModel({
        channelId: thread.parentID,
        guildId: thread.guild.id,
      }); //Create new channel data if none
      await Data.channel.save(); //Save the created channel data
    }

    if (Data.channel.threads.syncSlowmode && thread.parent.rateLimitPerUser)
      thread.setRateLimitPerUser(
        thread.parent.rateLimitPerUser,
        i18n.__("threads.syncRateLimitPerUserReason")
      ); //Set slowmode
  },
};
