const i18n = require("i18n");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "autothreads",
  usage: "<boolean: toggle>",
  management: true,
  guild: true,
  permissions: ["MANAGE_MESSAGES", "SEND_MESSAGES"],
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_MESSAGES"],
  description: i18n.__("autoThreads.description"),
  options: [
    {
      type: 1,
      name: "on",
      description: "Auto create threads",
      options: [
        {
          type: 3,
          name: "names",
          description: "Threads names, (ex: Comments)",
          required: true,
        },
        {
          type: 4,
          name: "duration",
          description: "Auto Archive Duration in minutes, (default: instantly)",
          choices: [
            { name: "instantly", value: 1 },
            { name: "1 Hour", value: 60 },
            { name: "1 Day", value: 1440 },
            { name: "3 Days", value: 4320 },
            { name: "1 Week", value: 10080 },
          ],
        },
        {
          type: 5,
          name: "auto_delete",
          description: "True: delete the thread on delete the message",
        },
      ],
    },
    {
      type: 1,
      name: "off",
      description: "Turn the shit off",
      options: [],
    },
  ],
  async execute(interaction, Data) {
    await interaction.deferReply();
    let toggle = interaction.options.getSubcommand() === "on" ? true : false;
    let names = interaction.options.getString("names");
    let autoArchiveDuration = interaction.options.getInteger("duration")
      ? interaction.options.getInteger("duration")
      : 1;
    let autoDelete =
      interaction.options.getBoolean("auto_delete") === null
        ? true
        : interaction.options.getBoolean("auto_delete");

    if (names.length > 16)
      return interaction.editReply("Thread names must be under 16 charactars");
    if (
      ["NONE", "TIER_1"].includes(interaction.guild.premiumTier) &&
      autoArchiveDuration > 1440
    )
      return interaction.editReply(
        "autoArchiveDuration above 24 hours only available for guilds with tier 2 and above"
      );

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
    let autoArchiveDurationFlags =
      autoArchiveDuration === 1
        ? "instantly"
        : autoArchiveDuration === 60
        ? "1 Hour"
        : autoArchiveDuration === 1440
        ? "1 Day"
        : autoArchiveDuration === 4320
        ? "3 Days"
        : "1 Week";

    interaction.editReply(
      `Auto threads \`${toggle}\`${
        toggle
          ? `\n**Names:** ${names} \n**Auto Archive Duration:** ${autoArchiveDurationFlags}`
          : ""
      }`
    );
  },
};
