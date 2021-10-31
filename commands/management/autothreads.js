const i18n = require("i18n");
const ms = require("ms");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "autothreads",
  usage: "<boolean: toggle>",
  cooldown: 15,
  management: true,
  guild: true,
  permissions: ["MANAGE_THREADS", "MANAGE_MESSAGES", "SEND_MESSAGES"],
  runPermissions: ["MANAGE_THREADS","MANAGE_MESSAGES"],
  description: i18n.__("autoThreads.description"),
  options: [
    {
      type: 1,
      name: "on",
      description: i18n.__("autoThreads.on.description"),
      options: [
        {
          type: 3,
          name: "names",
          description: i18n.__("autoThreads.on.namesDescription"),
          required: true,
        },
        {
          type: 4,
          name: "duration",
          description: i18n.__("autoThreads.on.durationDescription"),
          choices: [
            {
              name: i18n.__(
                "autoThreads.on.autoArchiveDurationFlags.instantly"
              ),
              value: 1,
            },
            {
              name: ms(60 * 60 * 1000, { long: true }).toLowerCase(),
              value: 60,
            },
            {
              name: ms(1440 * 60 * 1000, { long: true }).toLowerCase(),
              value: 1440,
            },
            {
              name: ms(4320 * 60 * 1000, { long: true }).toLowerCase(),
              value: 4320,
            },
            {
              name: ms(10080 * 60 * 1000, { long: true }).toLowerCase(),
              value: 10080,
            },
          ],
        },
        {
          type: 5,
          name: "auto_delete",
          description: i18n.__("autoThreads.on.auto_deleteDescription"),
        },
      ],
    },
    {
      type: 1,
      name: "off",
      description: i18n.__("autoThreads.off.description"),
      options: [],
    },
  ],
  async execute(interaction, Data) {
    await interaction.deferReply();
    let toggle = interaction.options.getSubcommand() === "on" ? true : false;
    let names = interaction.options.getString("names");
    let autoArchiveDuration = interaction.options.getInteger("duration");
    if (!autoArchiveDuration) autoArchiveDuration = 1;
    let autoDelete = interaction.options.getBoolean("auto_delete");
    if (autoDelete !== false) autoDelete = true;

    if (names?.length > 16)
      return interaction.editReply(i18n.__("autoThreads.on.maxNames"));
    if (
      ["NONE", "TIER_1"].includes(interaction.guild.premiumTier) &&
      autoArchiveDuration > 1440
    )
      return interaction.editReply(i18n.__("autoThreads.on.premiumTier"));

    if (
      toggle &&
      Data.guild.channels.autoThreads.ids.includes(interaction.channelId)
    ) {
      Data.guild.channels.autoThreads.options.splice(
        Data.guild.channels.autoThreads.ids.indexOf(interaction.channelId),
        1
      );
      deleteElements(
        Data.guild.channels.autoThreads.ids,
        interaction.channelId
      );
    }

    if (toggle) {
      Data.guild.channels.autoThreads.ids.push(interaction.channelId);
      Data.guild.channels.autoThreads.options.push({
        names: names,
        autoArchiveDuration: autoArchiveDuration,
        autoDelete: autoDelete ? true : undefined,
      });
      await Data.guild.save();
    } else {
      Data.guild.channels.autoThreads.options.splice(
        Data.guild.channels.autoThreads.ids.indexOf(interaction.channelId),
        1
      );
      deleteElements(
        Data.guild.channels.autoThreads.ids,
        interaction.channelId
      );
      await Data.guild.save();
    }
    let autoArchiveDurationFlag =
      autoArchiveDuration === 1
        ? i18n.__("autoThreads.on.autoArchiveDurationFlags.instantly")
        : ms(autoArchiveDuration * 60 * 1000, { long: true });

    let options = toggle
      ? i18n.__mf("autoThreads.on.options", {
          names: names,
          autoArchiveDurationFlag: autoArchiveDurationFlag,
          autoDelete: autoDelete,
        })
      : "";

    interaction.editReply(
      i18n.__mf("autoThreads.response", { toggle: toggle, options: options })
    );
  },
};
