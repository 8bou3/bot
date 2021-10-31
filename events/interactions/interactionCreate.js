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

    Data.color = "#000000";
    Data.language = Data.guild?.language ? Data.guild.language : "en";

    i18n.setLocale(Data.language);

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
              content: i18n.__("command.blacklistChannel"),
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
                channel: interaction.channel.id,
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
              content: i18n.__mf("command.missingPermission", {
                user: interaction.member.id,
                command: command.name,
                channel: interaction.channel.id,
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
                channel: interaction.channel.id,
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
              content: i18n.__mf("command.cooldown", {
                command: command.name,
                timeLeft: timeLeft.toFixed(2),
              }),
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
            i18n.__mf("error.message", {
              process: `executing the ${command.name} command`,
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
            content: i18n.__("button.notButton"),
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
            i18n.__mf("error.message", {
              process: `pressing the ${button.customId} button`,
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
            content: i18n.__("selectMenu.notSelectMenu"),
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
            i18n.__mf("error.message", {
              process: `selecting an option in the ${selectMenu.customId} select menuu`,
              errorMessage: error,
            })
          );
        }
        break;
    }
  },
};
