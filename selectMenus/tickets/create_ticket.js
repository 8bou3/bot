const { Collection } = require("discord.js");
const i18n = require("i18n");
const ticketModel = require("../../models/ticket");

module.exports = {
  customId: "create_ticket",
  async select(interaction, Data) {
    if (!Data.guild.tickets?.mode)
      return interaction.editReply(
        "**Error:**\n> Corruption in database `selectMenus(create_ticket)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );
    else if (
      Data.guild.tickets?.mode === "threads" &&
      ["NONE", "TIER_1"].includes(interaction.guild.premiumTier)
    )
      return interaction.editReply(
        "**Error:**\n> Tickets with threads only work in servers with tier2 & above `selectMenus(create_ticket)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );

    const messagesChannel = interaction.guild.channels.cache.get(
      Data.guild.tickets.messages?.channel
    );
    const openTicketMessage = await messagesChannel?.messages.fetch(
      Data.guild.tickets.messages.openTicket
    );
    const channel = interaction.guild.channels.cache.get(Data.guild.tickets.channel);
    if (!channel)
      return interaction.editReply(
        "**Error:**\n> No tickets channel `selectMenus(create_ticket)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );
    const parent = interaction.guild.channels.cache.get(Data.guild.tickets.parent);
    if (!parent)
      return interaction.editReply(
        "**Error:**\n> No parent channel `selectMenus(create_ticket)`\n\n||Report this to the support: https://discord.gg/YywkMTmHHb||"
      );

    const cooldownAmount = Data.guild.tickets.cooldown * 1000;
    if (!interaction.client.cache.cooldowns.has("create_ticket"))
      interaction.client.cache.cooldowns.set("create_ticket", new Collection());
    const timestamps = interaction.client.cache.cooldowns.get("create_ticket");
    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return interaction.editReply({
          embeds: [
            {
              color: `${Data.color}`,
              description: i18n.__mf("embeds.tickets.cooldown.description", {
                timeLeft: timeLeft.toFixed(1),
              }),
              title: i18n.__("embeds.tickets.cooldown.title"),
            },
          ],
          ephemeral: true,
        });
      } else timestamps.delete(interaction.user.id);
    }

    timestamps.set(interaction.user.id, Date.now());
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    let ticket;

    switch (Data.guild.tickets?.mode) {
      case "threads":
        const startMessage = await channel.send(
          openTicketMessage
            ? {
                content: openTicketMessage.content,
                attachments: openTicketMessage.attachments,
                embeds: openTicketMessage.embeds,
              }
            : `New Ticket!! <@&${Data.guild.roles.supportTeam}>`
        );
        ticket = await parent.threads.create({
          name: `open-${Data.guild.tickets.counter}`,
          startMessage: startMessage,
          autoArchiveDuration: 60, //60 | 1440 | 4320 | 10080
          type: 12,
        });

        break;

      case "classic":
        ticket = await parent.clone({
          name: `open-${Data.guild.tickets.counter}`,
          type: "GUILD_TEXT",
          parent: parent,
        });
        await ticket.permissionOverwrites.create(
          interaction.user,
          { VIEW_CHANNEL: true, SEND_MESSAGES: true },
          { type: 1, reason: "Ticket member" }
        );
        channel.send(
          openTicketMessage
            ? {
                content: openTicketMessage.content,
                attachments: openTicketMessage.attachments,
                embeds: openTicketMessage.embeds,
              }
            : `New Ticket!! <@&${Data.guild.roles.supportTeam}>`
        );

        break;
    }

    Data.ticket = new ticketModel({
      _id: ticket.id,
      guildId: interaction.guildId,

      number: Data.guild.tickets.counter,
      status: "open",
      members: [interaction.user.id],
    });
    Data.guild.tickets.counter += 1;
    Data.ticket.save();
    Data.guild.save();

    interaction.editReply(`You selected ${interaction.values.join(", ")}!`);
  },
};
