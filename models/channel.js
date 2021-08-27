const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  color: {
    type: String,
  },
  language: {
    type: String,
  },
  blacklist: { type: Boolean, default: false },
  ticket: {
    type: Boolean,
    default: false,
  },
  threads: {
    syncSlowmode: {
      type: Boolean,
      default: true,
    },
  },
  suggestionsChannel: {
    type: Boolean,
    default: false,
  },
  giveaways: [
    {
      messageId: {
        type: String,
      },
      name: {
        type: String,
      },
      hoster: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      startTime: {
        type: Date,
        default: Date.now(),
      },
      endTime: {
        type: Date,
        required: true,
      },
      members: {
        type: [String],
      },
      winners: {
        type: [String],
      },
      ended: {
        type: Boolean,
        default: false,
      },
    },
  ],
  channelId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
});

const MessageModel = (module.exports = mongoose.model(
  "channels",
  channelSchema
));
