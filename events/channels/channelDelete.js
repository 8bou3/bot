const guildModel = require("../../models/guild");
const ticketModel = require("../../models/ticket");
const { deleteElements } = require("../../functions/deleteElements");

module.exports = {
  name: "channelDelete",
  async execute(channel) {
    let Data = new Object();

    Data.ticket = await ticketModel.findById(channel.id);
    if (Data.ticket) Data.ticket.remove();

    Data.guild = await guildModel.findById(channel.guild.id);

    if (Data.guild) {
      if (Data.guild.messages?.channel === channel.id)
        Data.guild.messages = undefined;
      if (Data.guild.tickets.parent === channel.id) {
        Data.guild.tickets.parent = undefined;
        Data.guild.tickets.mode = undefined;
      }
      if (Data.guild.tickets.channel === channel.id) {
        Data.guild.tickets.channel = undefined;
        Data.guild.tickets.mode = undefined;
      }
      if (Data.guild.channels.autoThreads.ids.includes(channel.id))
        Data.guild.channels.autoThreads.options.splice(
          Data.guild.channels.autoThreads.ids.indexOf(channel.id),
          1
        );
      if (Data.guild.channels.slowmode.ids.includes(channel.id))
        Data.guild.channels.slowmode.options.splice(
          Data.guild.channels.slowmode.ids.indexOf(channel.id),
          1
        );
      deleteElements(Data.guild.channels.autoThreads.ids, channel.id);
      deleteElements(Data.guild.channels.slowmode.ids, channel.id);
      deleteElements(Data.guild.channels.autoCrosspost, channel.id);
      deleteElements(Data.guild.channels.blacklist, channel.id);
      Data.guild.save();
    }
  },
};
