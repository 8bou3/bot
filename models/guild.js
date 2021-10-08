const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
  color: { type: String, default: '#000000' },
  language: { type: String, default: 'en' },
  logs: {
    guild: {
      channel: { type: String },
      webhook: { id: { type: String }, token: { type: String } },
      thread: { type: String }
    },
    channels: {
      channel: { type: String },
      webhook: { id: { type: String }, token: { type: String } },
      thread: { type: String }
    },
    threads: {
      channel: { type: String },
      webhook: { id: { type: String }, token: { type: String } },
      thread: { type: String }
    },
    roles: {
      channel: { type: String },
      webhook: { id: { type: String }, token: { type: String } },
      thread: { type: String }
    },
    members: {
      channel: { type: String },
      webhook: { id: { type: String }, token: { type: String } },
      thread: { type: String }
    },
    moderation: {
      channel: { type: String },
      webhook: { id: { type: String }, token: { type: String } },
      thread: { type: String }
    }
  },
  tickets: {
    mode: { type: String },
    ticketsCounter: { type: Number, default: 0 },
    messages: {
      channel: { type: String },
      openTicket: { type: String }
    },
    openChannel: { type: String },
    channel: { type: String },
    cooldown: { type: Number }
  },
  channels: {
    starboard: [
      {
        emoji: { type: String },
        reactions: { type: Number },
        channel: { type: String }
      }
    ],
    blacklist: { type: [String] }
  },
  roles: {
    sticky: { type: [String] },
    supportTeam: { type: String },
    administrators: { type: [String] },
    moderators: { type: [String] }
  },
  automations: [
    {
      triggerType: { type: String }, //command | startsWith | contains | regex | exactMatch | message create-edit-remove | reaction add-remove | interval | channel create-update-remove | role create-update-remove | emoji create-update-remove
      trigger: { type: String },
      response: { type: String },
      roles: {
        Ignore: { type: Boolean }, //Require roles | Ignore roles
        ids: { type: [String] }
      },
      channels: {
        Ignore: { type: Boolean }, //Require channels | Ignore channels
        ids: { type: [String] }
      }
    }
  ],
  guildId: { type: String, required: true }
})

const MessageModel = (module.exports = mongoose.model('guilds', guildSchema))
