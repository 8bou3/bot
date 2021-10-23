module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    client.shard.broadcastEval((client) =>
      client.channels.cache.get("894601362808123455")?.send(
        `**Left ${guild.name}:**\n> Member Count: ${
          guild.memberCount
        }\n> Total Servers: ${client.shard
          .fetchClientValues("guilds.cache.size")
          .then((results) => {
            return results.reduce((acc, guildCount) => acc + guildCount, 0);
          })}\n> Date: <t:${Math.round(
          Date.now() / 100
        )}:D>\n> Time: <t:${Math.round(Date.now() / 100)}:T>`
      )
    );
  },
};
