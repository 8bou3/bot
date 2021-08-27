const i18n = require("i18n");
const { checkPermissions } = require("../../functions/load");

module.exports = {
  name: "clear",
  usage: "<amount: int> [channel: int, string, mention] [user: int, mention]",
  runPermissions: ["MANAGE_MESSAGES", "EMBED_LINKS", "SEND_MESSAGES"],
  permissions: ["MANAGE_MESSAGES"],
  cooldown: 10,
  guild: true,
  description: i18n.__("clear.description"),
  aliases: ["bulkdelete", "purge"],
  options: [
    {
      type: 4,
      name: "amount",
      description: "Amount of messages to delete",
    },
    {
      type: 7,
      name: "channel",
      description: "Channel",
    },
    {
      type: 6,
      name: "user",
      description: "Messages author",
    },
  ],
  async execute(interaction, guildData, channelData, client) {
    let color = channelData.color ? channelData.color : guildData.color;
    const rawAmount = interaction.options.getInteger("amount");
    const amount = rawAmount ? rawAmount : 100;
    if (amount >= 100 || amount <= 1)
      return interaction.reply({
        embeds: [
          {
            title: i18n.__("clear.embeds.noArgs.title"),
            description: i18n.__("clear.embeds.noArgs.description"),
            timestamp: Date.now(),
            color: `${color}`,
          },
        ],
        ephemeral: true,
      });

    const rawChannel = interaction.getChannel("channel");
    const channel = rawChannel
      ? interaction.guild.channels.cache.get(rawChannel)
      : interaction.channel;
    if (!channel)
      return interaction.reply({
        content: i18n.__("embeds.error.noTextChannel"),
        ephemeral: true,
      });
    if (!channel.isText())
      return interaction.reply({
        content: i18n.__("embeds.error.notTextChannel"),
        ephemeral: true,
      });
    const missingPermission = checkPermissions(
      interaction,
      channel,
      interaction.member,
      ["MANAGE_MESSAGES"],
      color
    );
    const botMissingPermission = checkPermissions(
      interaction,
      channel,
      client.user,
      ["MANAGE_MESSAGES", "EMBED_LINKS", "SEND_MESSAGES"],
      color
    );
    if (missingPermission || botMissingPermission) return;

    const rawUser = interaction.getUser("user");
    const SnowflakeRegExp = /\d{17,20}/g;
    const userId =
      rawUser && SnowflakeRegExp.test(rawUser) ? rawUser : rawUser?.id;

    try {
      if (userId) {
        const rawMessages = await channel.messages.fetch({ limit: 1000 });
        const messages = rawMessages
          .filter((message) => (message.author.id = userId))
          .last(amount);
        const deleted = await channel.bulkDelete(messages).size;
        await interaction.reply({
          embeds: [
            {
              title: i18n.__("clear.embeds.user.title"),
              description: i18n.__mf("clear.embeds.user.description", {
                deletedMessages: deleted,
                userId: userId,
                channel: channel,
              }),
              timestamp: Date.now(),
              color: `${color}`,
            },
          ],
        });
      } else {
        const deleted = await channel.bulkDelete(amount).size;
        await interaction.reply({
          embeds: [
            {
              title: i18n.__("clear.embeds.channel.title"),
              description: i18n.__mf("clear.embeds.channel.description", {
                deletedMessages: deleted,
                channel: channel,
              }),
              timestamp: Date.now(),
              color: `${color}`,
            },
          ],
        });
      }
    } catch (error) {
      console.warn(
        `An error occurred whilst using bulkDelete in ${interaction.channel}`
      );
      console.error(error);
      let errorsChannel = guildData.logs.errors.channel
        ? interaction.guild.channels.cache.get(guildData.logs.errors.channel)
        : interaction.channel;
      errorsChannel?.send(
        i18n.__mf("error.usingBulkDelete", {
          channel: interaction.channel,
          errorMessage: error,
        })
      );
    }
  },
};
