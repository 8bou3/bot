const i18n = require("i18n");
const { Collection } = require("discord.js");

const guildModel = require("../../models/guild");
const channelModel = require("../../models/channel");
const { checkPermissions } = require("../../functions/load");

module.exports = {
  name: "message",
  async execute(message, client) {
    const receivedTime = Date.now();

    if (!message.guild) return; //Return if dm or group
    if (message.webhookID) return; //Return if sent by webhook

    let guildData = await guildModel.findOne({ guildId: message.guild.id }); //Get guild data
    let channelData = await channelModel.findOne({
      channelId: message.channel.id,
    }); //Get channel data
    if (!guildData) {
      guildData = new guildModel({ guildId: message.guild.id }); //Create new guild data if none
      await guildData.save(); //Save the created guild data
    }
    if (!channelData) {
      channelData = new channelModel({
        channelId: message.channel.id,
        guildId: message.guild.id,
      }); //Create new channel data if none
      await channelData.save(); //Save the created channel data
    }

    if (channelData.blacklist) return; //Return if channel in blacklist

    let color = channelData.color ? channelData.color : guildData.color;
    let language = channelData.language
      ? channelData.language
      : guildData.language;

    i18n.setLocale(language); //Set the language

    if (message.author.bot) return; //Return if bot

    const commandRegExp = /^(<@!?856678848707035196>|=)\s*/g; //Not the best RegExp but it's working,, and if it works don't touch
    if (!commandRegExp.test(message.content.toLowerCase())) return; //Return if not started with prefix

    let usedPrefix = message.content.toLowerCase().match(commandRegExp).shift(); //Get the used prefix [/|mention]
    let args = message.content.slice(usedPrefix.length).trim().split(/ +/g); //Delete usedPrefix from the args
    const commandName = args.shift().toLowerCase(); //Take the command usage from the args
    const command =
      client.commands.get(commandName) || //Get the command by name
      client.commands.find(
        (command) => command.aliases && command.aliases.includes(commandName) //Get the command by aliases
      );

    if (!command || command.disabled) return; //Return if not an existing command or disabled

    if (
      (command.administrators &&
        guildData.roles.administrators[0] &&
        !message.member.roles.cache.some((role) =>
          guildData.roles.administrators.includes(role.id)
        )) || //check the administrators roles
      (command.moderators &&
        guildData.roles.moderators[0] &&
        !message.member.roles.cache.some((role) =>
          guildData.roles.moderators.includes(role.id)
        )) //And check the moderators roles
    ) {
      if (command.permissions) {
        if (
          checkPermissions(
            message,
            message.channel,
            message.member,
            command.permissions,
            color,
            false
          )
        )
          return message.reply({
            embeds: [
              {
                color: `${color}`,
                description: i18n.__mf("embeds.missingRole.description", {
                  command: command.name,
                  permissions: command.permissions.join("`, `"),
                  reqRoles: `${
                    command.moderators && guildData.roles.moderators[0]
                      ? "<@&" + guildData.roles.moderators.join(">\n <@&") + ">"
                      : ""
                  }${
                    command.administrators && guildData.roles.administrators[0]
                      ? "\n> <@&" +
                        guildData.roles.administrators.join(">\n <@&") +
                        ">"
                      : ""
                  }`,
                }),
                title: i18n.__("embeds.missingRole.title"),
              },
            ],
          });
      } else
        return message.reply({
          embeds: [
            {
              color: `${color}`,
              description: i18n.__mf("embeds.missingRole.description", {
                command: command.name,
                permissions: "none",
                reqRoles: `${
                  command.moderators && guildData.roles.moderators[0]
                    ? "<@&" + guildData.roles.moderators.join(">\n <@&") + ">"
                    : ""
                }${
                  command.administrators && guildData.roles.administrators[0]
                    ? "\n> <@&" +
                      guildData.roles.administrators.join(">\n <@&") +
                      ">"
                    : ""
                }`,
              }),
              title: i18n.__("embeds.missingRole.title"),
            },
          ],
        }); //Return if the author is missing the required roles and permissions for the command in this guild
    } else if (
      command.permissions &&
      checkPermissions(
        message,
        message.channel,
        message.member,
        command.permissions,
        color
      )
    )
      return; //Return if the user is missing the required permissions for the command in this channel/guild

    if (
      command.runPermissions &&
      checkPermissions(
        message,
        message.channel,
        client.user,
        command.permissions,
        color
      )
    )
      return; //Return if the bot is missing the required permissions for the command in this channel/guild
    //No permissions no command!!

    if (!client.cooldowns.has(command.name))
      client.cooldowns.set(command.name, new Collection()); //Create cooldowns collection for the command if none
    const timestamps = client.cooldowns.get(command.name); //Get the cooldowns collection for this command
    const cooldownAmount = (command.cooldown || 3) * 1000; //Default cooldown 3 sec
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //The time that the cooldown ends in
      if (receivedTime < expirationTime) {
        const timeLeft = (expirationTime - receivedTime) / 1000; //Time left
        return message.reply({
          embeds: [
            {
              color: `${color}`,
              description: i18n.__mf("embeds.cooldown.description", {
                command: command.name,
                timeLeft: timeLeft.toFixed(1),
              }),
              title: i18n.__("embeds.cooldown.title"),
            },
          ],
        });
      } else timestamps.delete(message.author.id); //To fix any bug in cooldowns
    } //Return if the user in cooldown

    timestamps.set(message.author.id, receivedTime); //Add user to the cooldown list
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //Auto remove user from cooldown list

    try {
      command.execute(
        message,
        args,
        guildData,
        channelData,
        client,
        receivedTime
      ); //Execute the command
      console.log(`${message.author.tag} used the '${command.name}' command`); //<In dev version only>
    } catch (error) {
      console.warn(
        `An error occurred whilst executing the '${command.name}' command`
      );
      console.error(error);
      let errorsChannel = guildData.logs.errors.channel
        ? message.guild.channels.cache.get(guildData.logs.errors.channel)
        : message.channel;
      errorsChannel?.send(
        i18n.__mf("error.executingCommand", {
          commandName: command.name,
          errorMessage: error,
        })
      );
    }
  },
};
