const i18n = require("i18n");

module.exports = {
  name: "gcreate",
  disabled: true,
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "ADD_REACTIONS"],
  description: i18n.__("giveaways.create.description"),
  permissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
  async execute(interaction, Data) {
    if (Data.channel.giveaways[4]) return;

    let giveawayMessage = await interaction.channel.send({
      embeds: [
        {
          color: `${Data.color}`,
          description: i18n.__mf(
            "giveaways.create.embeds.giveawayMessage.description"
          ),
        },
      ],
    });
    await giveawayMessage.react(`🎉`);
    await interaction.editReply(i18n.__("giveaways.create.created"));
  },
};
