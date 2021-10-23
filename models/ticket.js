const { Schema, model } = require("mongoose");

module.exports = model(
  "tickets",
  new Schema({
    _id: { type: String, required: true },
    guildId: { type: String, required: true },

    number: Number,
    status: String,
    staff: String,
    members: [String],
  })
);
