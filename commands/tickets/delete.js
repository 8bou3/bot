const i18n = require("i18n");
const ticketModel = require("../../models/ticket");

module.exports = {
  name: "delete",
  guild: true,
  support: true,
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_CHANNELS"],
  description: i18n.__("add.description"),
  options: [],
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
        "**Error:**\n> Tickets with threads only work in servers with tier2 & above `commands(delete)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
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

    await setTimeout(async () => {
      await interaction.channel.delete("Delete the ticket");
    }, 30000);

    interaction.editReply(
      `#${interaction.channel.name} will be deleted in <t:${
        Math.floor(Data.receivedTime / 1000) + 30
      }:T>`
    );
  },
};
