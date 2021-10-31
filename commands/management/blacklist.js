const i18n = require("i18n");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "blacklist",
  usage: "<boolean: toggle>",
  cooldown: 15,
  management: true,
  guild: true,
  permissions: ["MANAGE_CHANNELS"],
  runPermissions: ["SEND_MESSAGES"],
  description: i18n.__("blacklist.description"),
  options: [
    {
      type: 5,
      name: "boolean",
      description: i18n.__("blacklist.booleanDescription"),
    },
  ],
  async execute(interaction, Data) {
    await interaction.deferReply();
    let toggle = interaction.options.getBoolean("boolean");
    if (toggle === null)
      toggle = Data.guild.channels.blacklist.includes(interaction.channelId)
        ? false
        : true;

    if (
      toggle &&
      !Data.guild.channels.blacklist.includes(interaction.channelId)
    ) {
      Data.guild.channels.blacklist.push(interaction.channelId);
      await Data.guild.save();
    } else if (!toggle) {
      deleteElements(Data.guild.channels.blacklist, interaction.channelId);
      await Data.guild.save();
    }

    if (toggle)
      interaction.editReply(
        i18n.__mf("blacklist.added", { channel: interaction.channelId })
      );
    else
      interaction.editReply(
        i18n.__mf("blacklist.removed", { channel: interaction.channelId })
      );
  },
};
