const i18n = require("i18n");

module.exports = {
  name: "remove",
  usage: "<user>",
  guild: true,
  defer: true,
  support: true,
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_CHANNELS"],
  description: i18n.__("add.description"),
  options: [
    {
      type: 6,
      name: "user",
      description: "user",
      required: true,
    },
  ],
  async execute(interaction, Data) {
    if (!Data.guild.tickets?.mode)
      return interaction.editReply(
        "**Error:**\n> Corruption in database `commands(remove)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );
    else if (
      Data.guild.tickets?.mode === "threads" &&
      ["NONE", "TIER_1"].includes(interaction.guild.premiumTier)
    )
      return interaction.editReply(
        "**Error:**\n> Tickets with threads only work in servers with tier2 & above `commands(remove)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );

    if (Data.channel.ticket.number < 1)
      return interaction.editReply(
        "**Error:**\n> This command only works in tickets"
      );

    if (
      !interaction.member.roles.cache?.has(Data.guild.roles.supportTeam) &&
      interaction.channel
        .permissionsFor(interaction.member)
        ?.has(["ADMINISTRATOR"])
    )
      return interaction.editReply(
        "**Error:**\n> You must have the support team or ADMINISTRATOR permission"
      );

    let user = interaction.options.getUser("user");

    switch (Data.guild.tickets?.mode) {
      case "threads":
        await interaction.members.remove(user.id);
        Data.channel.ticket.members.push(user.id);
        Data.channel.save();
        break;

      case "classic":
        await interaction.channel.permissionOverwrites.delete(
          user,
          "remove user from ticket"
        );
        Data.channel.ticket.members.push(user.id);
        Data.channel.save();
        break;
    }

    interaction.editReply(`removed <@!${user.id}>`);
  },
};
