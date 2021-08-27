const i18n = require("i18n");

module.exports = {
  name: "gcreate",
  disabled: true,
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "ADD_REACTIONS"],
  description: i18n.__("giveaways.create.description"),
  permissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
  async execute(element, args, guildData, channelData, client, receivedTime) {
    if (element.commandName) await element.defer();
    let color = channelData.color ? channelData.color : guildData.color;

    if (channelData.giveaways[4]) return;

    let giveawayMessageData = {
      embeds: [
        {
          color: `${color}`,
          description: i18n.__mf(
            "giveaways.create.embeds.giveawayMessage.description"
          ),
        },
      ],
    };

    let giveawayMessage = await element.channel.send(giveawayMessageData);
    await giveawayMessage.react(`🎉`);

    if (element.commandName)
      await element.editReply(i18n.__("giveaways.create.created"));
  },
};
