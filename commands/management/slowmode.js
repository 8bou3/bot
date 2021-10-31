const i18n = require("i18n");
const ms = require("ms");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "slowmode",
  usage: "<boolean: toggle>",
  cooldown: 15,
  management: true,
  guild: true,
  permissions: ["MANAGE_THREADS"],
  runPermissions: ["SEND_MESSAGES", "MANAGE_THREADS"],
  description: i18n.__("slowmode.description"),
  options: [
    {
      type: 1,
      name: "auto",
      description: i18n.__("slowmode.auto.description"),
      options: [
        {
          type: 4,
          name: "timeout",
          description: i18n.__("slowmode.auto.timeoutDescription"),
          choices: [
            { name: i18n.__("slowmode.auto.timeoutFlags.sync"), value: 0 },
            { name: ms(1 * 1000, { long: true }), value: 1 },
            { name: ms(3 * 1000, { long: true }), value: 3 },
            { name: ms(5 * 1000, { long: true }), value: 5 },
            { name: ms(10 * 1000, { long: true }), value: 10 },
            { name: ms(30 * 1000, { long: true }), value: 30 },
            { name: ms(60 * 1000, { long: true }), value: 60 },
            { name: ms(180 * 1000, { long: true }), value: 180 },
            { name: ms(300 * 1000, { long: true }), value: 300 },
            { name: ms(600 * 1000, { long: true }), value: 600 },
            { name: ms(900 * 1000, { long: true }), value: 900 },
            { name: ms(1800 * 1000, { long: true }), value: 1800 },
            { name: ms(3600 * 1000, { long: true }), value: 3600 },
            { name: ms(10800 * 1000, { long: true }), value: 10800 },
            { name: ms(21600 * 1000, { long: true }), value: 21600 },
          ],
        },
        {
          type: 5,
          name: "toggle",
          description: i18n.__("slowmode.auto.toggleDescription"),
        },
      ],
    },
    {
      type: 1,
      name: "set",
      description: i18n.__("slowmode.set.description"),
      options: [
        {
          type: 4,
          name: "timeout",
          description: i18n.__("slowmode.set.timeoutDescription"),
          required: true,
        },
      ],
    },
  ],
  async execute(interaction, Data) {
    await interaction.deferReply();
    let subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "auto":
        timeout = interaction.options.getInteger("timeout");
        let toggle = interaction.options.getBoolean("boolean");
        if (toggle === null)
          toggle = Data.guild.channels.slowmode.id.includes(
            interaction.channelId
          )
            ? timeout === null
              ? false
              : true
            : true;

        if (timeout === null) timeout = 0;
        if (
          toggle &&
          !Data.guild.channels.slowmode.includes(interaction.channelId)
        ) {
          Data.guild.channels.slowmode.ids.push(interaction.channelId);
          Data.guild.channels.slowmode.options.push({ timeout: timeout });
          await Data.guild.save();
        } else if (!toggle) {
          Data.guild.channels.slowmode.options.splice(
            Data.guild.channels.slowmode.ids.indexOf(interaction.channelId),
            1
          );
          deleteElements(Data.guild.channels.slowmode, interaction.channelId);
          await Data.guild.save();
        }

        let timeoutFlag =
          timeout === 0
            ? i18n.__("slowmode.auto.timeoutFlags.sync")
            : ms(timeout * 1000, { long: true });

        interaction.editReply(
          i18n.__mf("slowmode.auto.response", {
            toggle: toggle,
            options: toggle
              ? i18n.__mf("slowmode.set.timeoutOption", {
                  timeoutFlag: timeoutFlag,
                })
              : "",
          })
        );
        break;

      default:
        timeout = interaction.options.getInteger("timeout");
        if (timeout < 0)
          return interaction.editReply(i18n.__("slowmode.set.minTimeout"));
        interaction.channel.setRateLimitPerUser(
          timeout,
          i18n.__mf("slowmode.set.reason", {
            user: `${interaction.user.tag} <@!${interaction.user.id}>`,
          })
        );
        interaction.editReply(
          i18n.__mf("slowmode.set.response", {
            timeout: timeout ? ms(timeout * 1000, { long: true }) : "off",
          })
        );
        break;
    }
  },
};
