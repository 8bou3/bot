const { Schema, model } = require("mongoose");

module.exports = model(
  "guilds",
  new Schema({
    _id: { type: String, required: true },

    color: { type: String, default: "#000000" },
    language: { type: String, default: "en" },

    messages: {
      channel: String,
      openTicket: String,
    },

    tickets: {
      mode: String,
      counter: { type: Number },
      parent: String,
      channel: String,
      cooldown: Number,
      options: [
        {
          label: String,
          value: String,
          description: String,
        },
      ],
    },

    channels: {
      suggestions: String,
      autoCrosspost: [String],
      syncSlowmode: [String],
      blacklist: [String],
    },

    roles: {
      sticky: [String],
      supportTeam: String,
      moderators: [String],
    },
  })
);
