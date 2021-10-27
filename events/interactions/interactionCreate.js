const i18n = require("i18n");
const { Collection } = require("discord.js");

const guildModel = require("../../models/guild");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    let Data = new Object();
    Data.receivedTime = Date.now();

    if (interaction.inGuild()) {
      Data.guild = interaction.client.cache.guilds.get(interaction.guildId);

      if (!Data.guild)
        Data.guild = await guildModel.findById(interaction.guildId);

      if (!Data.guild) {
        Data.guild = new guildModel({ _id: interaction.guildId });
        await Data.guild.save();
      }
    }

    Data.color = Data.guild?.color ? Data.guild.color : "#000000";
    Data.language = Data.guild?.language ? Data.guild.language : "en";

    i18n.setLocale("en");

    switch (true) {
      case interaction.isCommand():
        const command = interaction.client.cache.commands.get(
          interaction.commandName
        );
        if (!command || command.disabled)
          return interaction.reply({
            content: i18n.__("command.notCommand"),
            ephemeral: true,
          });

        if (interaction.inGuild()) {
          if (
            Data.guild.channels.blacklist.includes(interaction.channelId) &&
            !command.management
          )
            return interaction.reply({
              content: "Not allowed to use commands here",
              ephemeral: true,
            });
          if (
            command.permissions &&
            !interaction.channel
              .permissionsFor(interaction.member)
              .has(command.permissions)
          )
            return interaction.reply({
              content: i18n.__mf("command.missingPermission", {
                user: interaction.member.id,
                command: command.name,
                permissions: command.permissions.join("` `"),
              }),
              ephemeral: true,
            });
          else if (
            command.moderators &&
            Data.guild.roles.moderators[0] &&
            !interaction.member.roles.cache.some((role) =>
              Data.guild.roles.moderators.includes(role.id)
            )
          )
            return interaction.reply({
              content: i18n.__mf("command.missingRole", {
                command: command.name,
                permissions: command.permissions.join("` `"),
              }),
              ephemeral: true,
            });

          if (
            command.runPermissions &&
            !interaction.channel
              .permissionsFor(interaction.client.user)
              .has(command.runPermissions)
          )
            return interaction.reply({
              content: i18n.__mf("command.missingPermission", {
                user: interaction.client.user,
                command: command.name,
                permissions: command.runPermissions.join("` `"),
              }),
              ephemeral: true,
            });
        } else if (command.guild)
          return interaction.reply({
            content: i18n.__("command.noGuild"),
            ephemeral: true,
          });

        if (!interaction.client.cache.cooldowns.has(command.name))
          interaction.client.cache.cooldowns.set(
            command.name,
            new Collection()
          );
        const timestamps = interaction.client.cache.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(interaction.user.id)) {
          const expirationTime =
            timestamps.get(interaction.user.id) + cooldownAmount;
          if (Data.receivedTime < expirationTime) {
            const timeLeft = (expirationTime - Data.receivedTime) / 1000;
            return interaction.reply({
              embeds: [
                {
                  color: `${Data.color}`,
                  description: i18n.__mf("embeds.cooldown.description", {
                    command: command.name,
                    timeLeft: timeLeft.toFixed(1),
                  }),
                  title: i18n.__("embeds.cooldown.title"),
                },
              ],
              ephemeral: true,
            });
          } else timestamps.delete(interaction.user.id);
        }

        timestamps.set(interaction.user.id, Data.receivedTime);
        setTimeout(
          () => timestamps.delete(interaction.user.id),
          cooldownAmount
        );
        try {
          command.execute(interaction, Data);
          console.log(
            `${interaction.user.tag} used the '${command.name}' slash command`
          ); //<In dev version only>
        } catch (error) {
          console.warn(
            `An error occurred whilst executing the '${command.name}' command`
          );
          console.error(error);
          interaction.channel.send(
            i18n.__mf("error.executingCommand", {
              commandName: command.name,
              errorMessage: error,
            })
          );
        }
        break;

      case interaction.isButton():
        try {
          await interaction.deferReply({ ephemeral: true });
        } catch (error) {
          console.error(error);
        }

        const button = interaction.client.cache.buttons.get(
          interaction.customId
        );
        if (!button || button.disabled)
          return interaction.editReply({
            content: i18n.__("error.notButton"),
            ephemeral: true,
          });

        try {
          button.press(interaction, Data);
          console.log(
            `${interaction.user.tag} pressed the '${interaction.customId}' button`
          ); //<In dev version only>
        } catch (error) {
          console.warn(
            `An error occurred whilst pressing the '${interaction.customId}' button`
          );
          console.error(error);
          interaction.channel.send(
            i18n.__mf("error.pressingButton", {
              buttonCustomId: button.customId,
              errorMessage: error,
            })
          );
        }
        break;

      case interaction.isSelectMenu():
        try {
          await interaction.deferReply({ ephemeral: true });
        } catch (error) {
          console.error(error);
        }

        const selectMenu = interaction.client.cache.selectMenus.get(
          interaction.customId
        );
        if (!selectMenu || selectMenu.disabled)
          return interaction.editReply({
            content: i18n.__("error.notAnExistingSelectMenu"),
            ephemeral: true,
          });

        try {
          await selectMenu.select(interaction, Data);
          console.log(
            `${interaction.user.tag} used the '${interaction.customId}' selectMenu`
          ); //<In dev version only>
        } catch (error) {
          console.warn(
            `An error occurred whilst selecting the '${interaction.customId}' selectMenu`
          );
          console.error(error);
          interaction.channel.send(
            i18n.__mf("error.selectingMenu", {
              selectMenuCustomId: selectMenu.customId,
              errorMessage: error,
            })
          );
        }
        break;
    }
  },
};
