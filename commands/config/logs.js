const i18n = require("i18n");

const { checkPermissions, getTextChannel } = require("../../functions/load");

module.exports = {
  name: "logs",
  usage: "<action> <channel>",
  choices:
    "**actions:**\n> `messages`, `guilds`, `channels`, `threads`, `roles`, `emojis`, `members`, `moderation`, `giveaways`, `errors`, `bank`",
  permissions: ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
  runPermissions: ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
  description: i18n.__("logs.command.description"),
  aliases: ["log"],
  options: [
    {
      type: 3,
      name: "action",
      description: "Action type to log",
      choices: [
        {
          name: "messages",
          value: "messages",
        },
        {
          name: "guild",
          value: "guild",
        },
        {
          name: "channels",
          value: "channels",
        },
        {
          name: "threads",
          value: "threads",
        },
        {
          name: "roles",
          value: "roles",
        },
        {
          name: "emojis",
          value: "emojis",
        },
        {
          name: "members",
          value: "members",
        },
        {
          name: "moderation",
          value: "moderation",
        },
        {
          name: "giveaways",
          value: "giveaways",
        },
        {
          name: "errors",
          value: "errors",
        },
        {
          name: "bank",
          value: "bank",
        },
      ],
      required: true,
    },
    {
      type: 7,
      name: "channel",
      description: "Logging channel",
      required: true,
    },
  ],
  async execute(element, args, guildData, channelData, client) {
    let color = channelData.color ? channelData.color : guildData.color;
    let action = args[0]?.toLowerCase();

    let channel;
    let missingPermission;
    let botMissingPermission;
    let webhook;

    switch (action) {
      case "messages":
      case "message":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.messages?.webhook &&
          guildData.logs?.messages?.channel === channel.id
            ? guildData.logs?.messages?.webhook
            : await channel.createWebhook("Imagin a bot - messages logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.messages = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "guilds":
      case "guild":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.guild?.webhook &&
          guildData.logs?.guild?.channel === channel.id
            ? guildData.logs?.guild?.webhook
            : await channel.createWebhook("Imagin a bot - guild logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.guild = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "channels":
      case "channel":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.channels?.webhook &&
          guildData.logs?.channels?.channel === channel.id
            ? guildData.logs?.channels?.webhook
            : await channel.createWebhook("Imagin a bot - channels logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.channels = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "threads":
      case "thread":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.threads?.webhook &&
          guildData.logs?.threads?.channel === channel.id
            ? guildData.logs?.threads?.webhook
            : await channel.createWebhook("Imagin a bot - threads logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.threads = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "roles":
      case "role":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.roles?.webhook &&
          guildData.logs?.roles?.channel === channel.id
            ? guildData.logs?.roles?.webhook
            : await channel.createWebhook("Imagin a bot - roles logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.roles = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "emojis":
      case "emoji":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.emojis?.webhook &&
          guildData.logs?.emojis?.channel === channel.id
            ? guildData.logs?.emojis?.webhook
            : await channel.createWebhook("Imagin a bot - emojis logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.emojis = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "members":
      case "member":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.members?.webhook &&
          guildData.logs?.members?.channel === channel.id
            ? guildData.logs?.members?.webhook
            : await channel.createWebhook("Imagin a bot - members logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.members = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "moderation":
      case "mod":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.moderation?.webhook &&
          guildData.logs?.moderation?.channel === channel.id
            ? guildData.logs?.moderation?.webhook
            : await channel.createWebhook("Imagin a bot - moderation logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.moderation = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "giveaways":
      case "giveaway":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.giveaways?.webhook &&
          guildData.logs?.giveaways?.channel === channel.id
            ? guildData.logs?.giveaways?.webhook
            : await channel.createWebhook("Imagin a bot - giveaways logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.giveaways = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      case "errors":
      case "error":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;

        guildData.logs.errors = {
          channel: channel.id,
        };
        break;
      case "bank":
        channel = getTextChannel(element, args[1], color);
        if (!channel) return;
        missingPermission = checkPermissions(
          element,
          channel,
          element.member,
          ["MANAGE_GUILD", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"],
          color
        );
        botMissingPermission = checkPermissions(
          element,
          channel,
          client.user,
          ["MANAGE_WEBHOOKS", "EMBED_LINKS", "SEND_MESSAGES"],
          color
        );
        if (missingPermission || botMissingPermission) return;
        webhook =
          guildData.logs?.bank?.webhook &&
          guildData.logs?.bank?.channel === channel.id
            ? guildData.logs?.bank?.webhook
            : await channel.createWebhook("Imagin a bot - bank logger", {
                avatar: "https://i.imgur.com/Oy59yKX.png",
                reason: i18n.__("logs.command.createWebhookReason"),
              });

        guildData.logs.bank = {
          channel: channel.id,
          webhook: {
            id: webhook.id,
            token: webhook.token,
          },
        };
        break;
      default:
        element.reply({
          embeds: [
            {
              color: `${color}`,
              description: i18n.__("logs.command.embeds.noAction.description"),
              title: i18n.__("logs.command.embeds.noAction.title"),
            },
          ],
          ephemeral: true,
        });
        break;
    }

    await guildData.save();
    element.reply({
      embeds: [
        {
          color: `${color}`,
          description: i18n.__mf("logs.command.embeds.setLogs.description", {
            channel: channel.id,
            action: action,
          }),
          title: i18n.__("logs.command.embeds.setLogs.title"),
        },
      ],
    });
  },
};
