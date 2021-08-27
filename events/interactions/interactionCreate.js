const i18n = require("i18n");
const { Collection } = require("discord.js");

const guildModel = require("../../models/guild");
const channelModel = require("../../models/channel");
const { checkPermissions } = require("../../functions/load");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const receivedTime = Date.now();
    switch (true) {
      case interaction.isCommand():
        const command = client.commands.get(interaction.commandName);
        if (!command || command.disabled)
          return interaction.reply({
            content: i18n.__("error.notAnExistingCommand"),
            ephemeral: true,
          });

        let guildData = await guildModel.findOne({
          guildId: interaction.guildId,
        }); //Get guild data
        let channelData = await channelModel.findOne({
          channelId: interaction.channelId,
        }); //Get channel data

        if (command.guild) {
          if (!interaction.inGuild())
            return interaction.reply({
              content: i18n.__("error.onlyGuildCommand"),
              ephemeral: true,
            });
          else {
            if (!guildData) {
              guildData = new guildModel({ guildId: interaction.guildId }); //Create new guild data if none
              await guildData.save(); //Save the created guild data
            }
            if (!channelData) {
              channelData = new channelModel({
                channelId: interaction.channelId,
                guildId: interaction.guildId,
              }); //Create new channel data if none
              await channelData.save(); //Save the created channel data
            }
          }
        }

        let color = channelData?.color ? channelData?.color : guildData?.color;
        let language = channelData.language
          ? channelData.language
          : guildData.language;

        i18n.setLocale(language); //Set the language

        if (
          (command.administrators &&
            guildData.roles.administrators[0] &&
            !interaction.member.roles.cache.some((role) =>
              guildData.roles.administrators.includes(role.id)
            )) || //check the administrators roles
          (command.moderators &&
            guildData.roles.moderators[0] &&
            !interaction.member.roles.cache.some((role) =>
              guildData.roles.moderators.includes(role.id)
            )) //And check the moderators roles
        )
          return interaction.reply({
            embeds: [
              {
                color: `${color}`,
                description: i18n.__mf("command.embeds.noRole.description", {
                  command: command.name,
                  permissions: command.permissions.join("` `"),
                }),
                title: i18n.__("command.embeds.noRole.title"),
              },
            ],
            ephemeral: true,
          });
        //Return if the author is missing the required roles for the command in this guild
        else if (
          command.permissions &&
          checkPermissions(
            interaction,
            interaction.channel,
            interaction.member,
            command.permissions,
            color
          )
        )
          return; //Return if the author is missing the required permissions for the command in this channel/guild

        if (
          command.runPermissions &&
          checkPermissions(
            interaction,
            interaction.channel,
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
        if (timestamps.has(interaction.user.id)) {
          const expirationTime =
            timestamps.get(interaction.user.id) + cooldownAmount; //The time that the cooldown ends in
          if (receivedTime < expirationTime) {
            const timeLeft = (expirationTime - receivedTime) / 1000; //Time left
            return interaction.reply({
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
              ephemeral: true,
            });
          } else timestamps.delete(interaction.user.id); //To fix any bug in cooldowns
        } //Return if the user in cooldown

        timestamps.set(interaction.user.id, receivedTime); //Add user to the cooldown list
        setTimeout(
          () => timestamps.delete(interaction.user.id),
          cooldownAmount
        ); //Auto remove user from cooldown list
        try {
          command.execute(
            interaction,
            guildData,
            channelData,
            client,
            receivedTime
          ); //Execute the command
          console.log(
            `${interaction.user.tag} used the '${command.name}' slash command`
          ); //<In dev version only>
        } catch (error) {
          console.warn(
            `An error occurred whilst executing the '${command.name}' command`
          );
          console.error(error);
          let errorsChannel = guildData.logs.errors.channel
            ? interaction.guild.channels.cache.get(
                guildData.logs.errors.channel
              )
            : interaction.channel;
          errorsChannel?.send(
            i18n.__mf("error.executingCommand", {
              commandName: command.name,
              errorMessage: error,
            })
          );
        }
        break;

      case interaction.isButton():
        break;
    }
  },
};
