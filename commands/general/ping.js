const i18n = require("i18n");

module.exports = {
  name: "ping",
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
  description: i18n.__("ping.description"),
  execute(interaction, Data) {
    interaction.reply("wait...").then(async (sent) => {
      //Test event sender
      if (!sent) sent = await interaction.fetchReply();
      let websocketShardsHeartbeat = [];
      interaction.client.ws.shards.each((shard) =>
        websocketShardsHeartbeat.push(
          i18n.__mf("ping.websocketShardsHeartbeat", {
            shardId: shard.id,
            shardPing: Math.round(shard.ping),
          })
        )
      );
      interaction
        .editReply({
          content: null, //Clear the message content
          embeds: [
            {
              color: `${Data.color}`,
              description: i18n.__mf("ping.embed.description", {
                roundtripLatency:
                  sent.createdTimestamp - interaction.createdTimestamp,
                listenerLatency:
                  Data.receivedTime - interaction.createdTimestamp,
                websocketShardsHeartbeat: websocketShardsHeartbeat.join("\n"),
              }),
            },
          ],
        })
        .catch((error) => {
          console.warn(
            `An error occurred whilst editing reply in '${interaction.channel.name}'`
          );
          console.error(error);
          if (interaction.commandName)
            interaction.followUp(
              i18n.__mf("error.editingMessage", {
                channel: interaction.channel.id,
                errorMessage: error,
              })
            );
        });
    });
  },
};
