const i18n = require("i18n");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "syncslowmode",
  usage: "<boolean: toggle>",
  permissions: ["MANAGE_THREADS"],
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_THREADS"],
  description: i18n.__("syncslowmode.description"),
  options: [
    {
      type: 5,
      name: "boolean",
      description: "True: on, False: off",
    },
  ],
  async execute(interaction, Data) {
    await interaction.deferReply();
    let toggle = interaction.options.getBoolean("boolean");
    if (toggle === null)
      toggle = Data.guild.channels.syncSlowmode.includes(interaction.channel.id)
        ? false
        : true;

    if (
      toggle &&
      !Data.guild.channels.syncSlowmode.includes(interaction.channel.id)
    ) {
      Data.guild.channels.syncSlowmode.push(interaction.channel.id);
      await Data.guild.save();
    } else if (!toggle) {
      deleteElements(Data.guild.channels.syncSlowmode, interaction.channel.id);
      await Data.guild.save();
    }

    interaction.editReply(`Sync slowmode \`${toggle}\``);
  },
};
