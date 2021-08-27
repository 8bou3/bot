const i18n = require("i18n");

function getTextChannel(interaction, args, color) {
  const channel = interaction.commandName
    ? interaction.guild.channels.cache.get(args)
    : interaction.mentions.channels.first() ||
      interaction.guild.channels.cache.get(args) ||
      interaction.guild.channels.cache.find(
        (channel) => args === channel.name && channel.isText()
      );
  if (!channel || !channel.isText()) {
    interaction.reply({
      content: i18n.__("embeds.error.noTextChannel"),
      ephemeral: true,
    });
    return undefined;
  } else return channel;
}

module.exports = {
  getTextChannel,
};
