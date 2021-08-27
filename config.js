module.exports = {
  clientData: {
    clientOptions: {
      partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
      ],
    },
    token: process.env.TOKEN,
  },
  mongoPath: process.env.MONGO_PATH,
  locales: ["en", "ar"],
};
