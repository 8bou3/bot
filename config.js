module.exports = {
  clientData: {
    clientOptions: {
      partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE"],
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_WEBHOOKS",
        "GUILD_MESSAGES",
      ],
      ws: { properties: { $browser: "Discord iOS" } },
    },
    token: process.env.TOKEN,
  },
  mongoPath: process.env.MONGO_URI,
  locales: ["en", "ar"],
};
