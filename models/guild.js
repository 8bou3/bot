const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  color: {
    type: String,
    default: "#000000",
  },
  language: {
    type: String,
    default: "en",
  },
  onlySlash: {
    type: Boolean,
  },
  logs: {
    guild: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    channels: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    threads: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    roles: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    emojis: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    members: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    moderation: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    giveaways: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    errors: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
    bank: {
      channel: { type: String },
      webhook: {
        id: { type: String },
        token: { type: String },
      },
      thread: { type: String },
    },
  },
  tickets: {
    status: {
      type: String,
    },
    panels: [
      {
        ticketsCounter: {
          type: Number,
        },
        logChannel: {
          type: String,
        },
        staffRole: {
          type: String,
        },
        openMessage: {
          content: {
            type: String,
          },
          embeds: [
            {
              title: {
                type: String,
              },
              description: {
                type: String,
              },
              timestamp: {
                type: Boolean,
                default: false,
              },
              color: {
                type: String,
              },
              fields: [
                {
                  name: {
                    type: String,
                    required: true,
                  },
                  value: {
                    type: String,
                    required: true,
                  },
                  inline: {
                    type: Boolean,
                  },
                },
              ],
            },
          ],
          attachment: {
            type: String,
          },
        },
        messageId: {
          type: String,
        },
        channelId: {
          type: String,
        },
      },
    ],
  },
  channels: {
    starboard: {
      emoji: {
        type: String,
      },
      reactions: {
        type: Number,
      },
      channel: {
        type: String,
      },
    },
    blacklist: {
      type: [String],
    },
  },
  roles: {
    sticky: {
      type: [String],
    },
    administrators: {
      type: [String],
    },
    moderators: {
      type: [String],
    },
  },
  currency: {
    bank: {
      stock: {
        type: Number,
        default: 0,
      },
    },
  },
  membership: {
    tier: {
      type: Number,
      default: 1,
    },
    endTime: {
      type: Date,
    },
  },
  automations: [
    {
      triggerType: { type: String }, //command | startsWith | contains | regex | exactMatch | message create-edit-remove | reaction add-remove | interval | channel create-update-remove | role create-update-remove | emoji create-update-remove
      trigger: { type: String },
      response: { type: String },
      roles: {
        Ignore: { type: Boolean }, //Require roles | Ignore roles
        ids: { type: [String] },
      },
      channels: {
        Ignore: { type: Boolean }, //Require channels | Ignore channels
        ids: { type: [String] },
      },
    },
  ],
  guildId: {
    type: String,
    required: true,
  },
});

const MessageModel = (module.exports = mongoose.model("guilds", guildSchema));
