const i18n = require("i18n");

async function awaitAutherMessages(message, triggerType, trigger) {
  const filter = (response) => response.author.id === message.author.id;

  await message.channel
    .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
    .then((collected) => {
      let response = collected.first();
      switch (triggerType) {
        case "regex":
          if (trigger.test(response.content)) return response.content;
          else return false;
        case "number":
          if (!isNaN(response.content) && response.content <= trigger)
            return response.content;
          else return false;
        case "channel":
          let targetChannel =
            response.mentions.channels.first() ||
            response.guild.channels.cache.get(response.content) ||
            response.guild.channels.cache.filter(
              (channel) => channel.name === response.content && channel.isText()
            );
          if (targetChannel) return targetChannel;
          else return false;
        case "role":
          let targetRole =
            response.mentions.roles.first() ||
            response.guild.roles.cache.get(response.content) ||
            response.guild.roles.cache.filter(
              (role) => role.name === response.content && role.isText()
            );
          if (targetRole) return targetRole;
          else return false;
        case "option":
          if (trigger.includes(response.content)) return response.content;
          else return false;

        default:
          break;
      }
    })
    .catch(() => {
      message.reply({
        embeds: [
          {
            description: i18n.__mf("errors.noAutherResponse.description"),
            timestamp: Date.now(),
            color: `${color}`,
          },
        ],
      });
    });
}

module.exports = {
  awaitAutherMessages,
};
