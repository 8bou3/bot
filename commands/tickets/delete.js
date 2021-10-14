const i18n = require("i18n");

module.exports = {
  name: "delete",
  guild: true,
  defer: true,
  support: true,
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_CHANNELS"],
  description: i18n.__("add.description"),
  options: [],
  async execute(interaction, Data) {
    if (!Data.guild.tickets?.mode)
      return interaction.editReply(
        "**Error:**\n> Corruption in database `commands(delete)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );
    else if (
      Data.guild.tickets?.mode === "threads" &&
      ["NONE", "TIER_1"].includes(interaction.guild.premiumTier)
    )
      return interaction.editReply(
        "**Error:**\n> Tickets with threads only work in servers with tier2 & above `commands(delete)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
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

    await setTimeout(async () => {
      await interaction.channel.delete("Delete the ticket");
      await Data.channel.remove();
    }, 30000);

    interaction.editReply(
      `#${interaction.channel.name} will be deleted in <t:${
        Math.floor(Data.receivedTime / 1000) + 30
      }:T>`
    );
  },
};
