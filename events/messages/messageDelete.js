const { WebhookClient } = require('discord.js')
const i18n = require('i18n')
const guildModel = require('../../models/guild')

module.exports = {
  name: 'messageDelete',
  async execute (message) {
    // if (message.author?.bot) return; //Return if bot
    // if (!message.guild) return; //Return if dm or group
    // if (message.webhookID) return; //Return if sent by webhook
    // let guildData = await guildModel.findOne({ guildId: message.guild.id }); //Get guild data
    // if (!guildData) {
    //   guildData = new guildModel({ guildId: message.guild.id }); //Create new guild data if none
    //   await guildData.save(); //Save the created guild data
    // }
    // i18n.setLocale(guildData.language); //Set the language
    // if (!guildData.logs.messages.webhook.id) return;
    // try {
    //   const webhookClient = new WebhookClient(
    //     guildData.logs.messages.webhook.id,
    //     guildData.logs.messages.webhook.token
    //   );
    //   let fields = [];
    //   let attachmentURLs = [];
    //   message.attachments.each((attachment) =>
    //     attachmentURLs.push(`[${attachment.name}](${attachment.url})`)
    //   );
    //   const fetchedLogs = await message.guild.fetchAuditLogs({
    //     limit: 1,
    //     type: "MESSAGE_DELETE",
    //   });
    //   const deletionLog = fetchedLogs.entries.first();
    //   if (!deletionLog)
    //     fields.push({
    //       name: i18n.__("logs.messageDelete.executorName"),
    //       value: i18n.__mf("logs.messageDelete.noRelevant"),
    //     });
    //   else {
    //     const { executor, reason, target } = deletionLog;
    //     if (target.id === message.author?.id) {
    //       fields.push({
    //         name: i18n.__("logs.messageDelete.executorName"),
    //         value: `${executor?.tag.trim()}: <@!${executor?.id}> (${
    //           executor?.id
    //         })`,
    //       });
    //       if (reason)
    //         fields.push({
    //           name: i18n.__("logs.messageDelete.reasonName"),
    //           value: reason,
    //         });
    //     } else {
    //       fields.push({
    //         name: i18n.__("logs.messageDelete.executorName"),
    //         value: i18n.__mf("logs.messageDelete.noExecutor"),
    //       });
    //     }
    //   }
    //   if (attachmentURLs[0])
    //     fields.push({
    //       name: i18n.__("logs.messageDelete.attachmentURLsName"),
    //       value: i18n.__mf("logs.messageDelete.attachmentURLsValue", {
    //         attachments: attachmentURLs.join("\n> "),
    //       }),
    //     });
    //   if (message.embeds[0])
    //     fields.push({
    //       name: i18n.__("logs.messageDelete.embedsName"),
    //       value: i18n.__("logs.messageDelete.embedsAwaitMessage"),
    //     });
    //   await webhookClient.send({
    //     threadID: guildData.logs?.messages?.thread
    //       ? guildData.logs.messages.thread
    //       : undefined,
    //     embeds: [
    //       {
    //         title: i18n.__mf("logs.messageDelete.title", {
    //           channel: message.channel.name,
    //         }),
    //         description: message.content,
    //         url: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
    //         timestamp: Date.now(),
    //         color: "#ff0000",
    //         fields: fields,
    //         author: {
    //           name: message.author
    //             ? `${message.author?.tag.trim()} (${message.author?.id})`
    //             : "null",
    //           iconURL: message.author?.displayAvatarURL({ dynamic: true })
    //             ? message.author?.displayAvatarURL({ dynamic: true })
    //             : undefined,
    //         },
    //         footer: {
    //           text: `Message ID: ${message.id}`,
    //           iconURL: message.guild.iconURL({ dynamic: true }),
    //         },
    //       },
    //     ],
    //   });
    // } catch (error) {
    //   console.warn(
    //     `An error occurred whilst logging the 'messageDelete' event`
    //   );
    //   console.error(error);
    //   let errorsChannel = guildData.logs.errors.channel
    //     ? message.guild.channels.cache.get(guildData.logs.errors.channel)
    //     : message.channel;
    //   errorsChannel?.send(
    //     i18n.__mf("error.loggingEvent", {
    //       event: "messageDelete",
    //       errorMessage: error,
    //     })
    //   );
    // }
  }
}
