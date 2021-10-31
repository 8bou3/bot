const i18n = require("i18n");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "autocrosspost",
  description: i18n.__("autoCrosspost.description"),
  usage: "<boolean: toggle>",
  cooldown: 15,
  management: true,
  guild: true,
  permissions: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
  runPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
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
      toggle = Data.guild.channels.autoCrosspost.includes(interaction.channelId)
        ? false
        : true;

    if (
      toggle &&
      !Data.guild.channels.autoCrosspost.includes(interaction.channelId)
    ) {
      Data.guild.channels.autoCrosspost.push(interaction.channelId);
      await Data.guild.save();
    } else if (!toggle) {
      deleteElements(Data.guild.channels.autoCrosspost, interaction.channelId);
      await Data.guild.save();
    }

    interaction.editReply(
      i18n.__mf("autoCrosspost.response", {
        toggle: toggle,
        notes:
          interaction.channel.type !== "GUILD_NEWS"
            ? `\n\n\`-\` ${i18n.__("autoCrosspost.notes.notNewsChannels")}`
            : "",
      })
    );
  },
};
