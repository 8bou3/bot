const i18n = require("i18n");
const ticketModel = require("../../models/ticket");

module.exports = {
  name: "add",
  usage: "<user>",
  disabled: true,
  guild: true,
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
    await interaction.deferReply();
    if (!Data.guild.tickets?.mode)
      return interaction.editReply(
        "**Error:**\n> Corruption in the database or no ticket sys in this guild `commands(add)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );
    else if (
      Data.guild.tickets?.mode === "threads" &&
      ["NONE", "TIER_1"].includes(interaction.guild.premiumTier)
    )
      return interaction.editReply(
        "**Error:**\n> Tickets with threads only work in servers with tier2 & above `commands(add)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );

    Data.ticket = await ticketModel.findById(interaction.channel.id);

    if (!Data.ticket)
      return interaction.editReply(
        "**Error:**\n> This command only works in tickets"
      );

    if (
      !interaction.member.roles.cache?.has(Data.guild.roles.supportTeam) &&
      !interaction.channel
        .permissionsFor(interaction.member)
        ?.has(["ADMINISTRATOR"])
    )
      return interaction.editReply(
        "**Error:**\n> You must have the support team or ADMINISTRATOR permission"
      );

    let user = interaction.options.getUser("user");

    switch (Data.guild.tickets?.mode) {
      case "threads":
        await interaction.members.add(user);
        Data.ticket.members.push(user.id);
        Data.ticket.save();
        break;

      case "classic":
        await interaction.channel.permissionOverwrites.create(
          user,
          { VIEW_CHANNEL: true, SEND_MESSAGES: true },
          { type: 1, reason: "add user to ticket" }
        );
        Data.ticket.members.push(user.id);
        Data.ticket.save();
        break;
    }

    interaction.editReply(`added <@!${user.id}>`);
  },
};
