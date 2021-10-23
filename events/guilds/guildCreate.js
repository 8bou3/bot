module.exports = {
  name: "guildCreate",
  async execute(guild, client) {
    client.channels.cache.get("894601362808123455")?.send(
      `**Joined ${guild.name}:**\n> Member Count: ${
        guild.memberCount
      }\n> Total Servers: ${client.guilds.cache.size}\n> Date: <t:${Math.round(
        Date.now() / 100
      )}:D>\n> Time: <t:${Math.round(Date.now() / 100)}:T>`
    );
  },
};
