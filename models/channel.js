const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  color: { type: String },
  language: { type: String },
  blacklist: { type: Boolean },
  suggestions: { type: Boolean },
  ticketNumber: { type: Number },
  giveaways: [
    {
      messageId: { type: String },
      name: { type: String },
      hoster: { type: String },
      quantity: { type: Number },
      startTime: { type: Date, default: Date.now() },
      endTime: { type: Date, required: true },
      members: { type: [String] },
      tags: {
        winOnce: { type: Boolean },
        inGuild: { type: Boolean },
      },
    },
  ],
  ticket: {
    status: { type: String },
    members: {
      staff: { type: String },
      members: { type: [String] },
      speakers: { type: [String] },
    },
  },
  channelId: { type: String, required: true },
  guildId: { type: String, required: true },
});

const MessageModel = (module.exports = mongoose.model(
  "channels",
  channelSchema
));
