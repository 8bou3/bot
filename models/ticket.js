const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: Number
  },
  status: {
    type: String
  },
  members: {
    staff: {
      type: String
    },
    members: {
      type: [String]
    },
    speakers: {
      type: [String]
    }
  },
  messages: [{
    content: {
      type: String
    },
    embeds: [{
      title: {
        type: String
      },
      description: {
        type: String
      },
      url: {
        type: String
      },
      timestamp: {
        type: Date
      },
      color: {
        type: String
      },
      fields: [{
        name: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        inline: {
          type: Boolean
        }
      }],
      author: {
        type: String
      },
      thumbnail: {
        type: String
      },
      image: {
        type: String
      },
      video: {
        type: String
      },
      footer: {
        text: {
          type: String
        },
        iconURL: {
          type: String
        }
      }
    }],
    attachments: [{
      type: String
    }]
  }],
  channelId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  }
})

const MessageModel = (module.exports = mongoose.model("tickets", ticketSchema));