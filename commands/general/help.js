const i18n = require("i18n");
const fs = require("fs");

module.exports = {
  name: "help",
  usage: "[command]",
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
  description: i18n.__("help.description"),
  aliases: ["command", "commands"],
  options: [
    {
      type: 3,
      name: "command",
      description: "Choice a command",
      choices: [
        {
          name: "logs",
          value: "logs",
        },
        {
          name: "help",
          value: "help",
        },
        {
          name: "ping",
          value: "ping",
        },
      ],
    },
  ],
  execute(interaction, guildData, channelData, client) {
    let color = channelData.color ? channelData.color : guildData.color;
    const commandName = interaction.options.getString("command");
    if (!commandName) {
      let fields = []; //Create array for fields
      const commandFolders = fs.readdirSync("./commands");
      for (const folder of commandFolders) {
        let commands = []; //Create array for commands categories
        const commandFiles = fs
          .readdirSync(`./commands/${folder}`)
          .filter((file) => file.split(".").pop() === "js");
        for (const file of commandFiles) {
          const command = require(`../../commands/${folder}/${file}`);
          if (command.hidden || command.disabled) continue; //Continue if the command hidden/disabled
          if (
            command.permissions &&
            !interaction.channel
              .permissionsFor(interaction.member)
              .has(command.permissions)
          )
            continue; //Continue if the user dosn't have the required permissions
          let data = `\`/${command.name}\``;
          if (command.description) {
            let description = command.description;
            if (description.length > 32)
              description = description.substring(0, 32) + "...";
            data = `\`/${command.name}\`\n> ${description}`;
          } //If the command have description add it
          commands.push(data);
        }
        if (!commands[0]) continue; //Continue if the category is empty
        fields.push({
          name: folder,
          value: commands.join("\n\n"),
          inline: true,
        });
      }

      interaction
        .reply({
          embeds: [
            {
              title: i18n.__("help.embeds.menu.title"),
              description: i18n.__("help.embeds.menu.description"),
              timestamp: Date.now(),
              color: `${color}`,
              fields: fields,
              author: {
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
              },
              footer: {
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              },
            },
          ],
        })
        .catch((error) => {
          console.warn(
            `Could not send help menu in ${interaction.channel.name}`
          );
          console.error(error);
          let errorsChannel = guildData.channels.errors
            ? interaction.guild.channels.cache.get(guildData.channels.errors)
            : interaction.channel;
          errorsChannel.send(
            i18n.__mf("error.sendingMessage", {
              channel: interaction.channel.id,
              errorMessage: error,
            })
          );
        });
    } else {
      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (command) => command.aliases && command.aliases.includes(commandName)
        ); //Get the command data by name or aliases
      if (!command)
        return interaction.reply({
          embeds: [
            {
              title: i18n.__("help.embeds.invalidCommand.title"),
              description: i18n.__("help.embeds.invalidCommand.description"),
              timestamp: Date.now(),
              color: `${color}`,
            },
          ],
          ephemeral: true,
        }); //Return if not an existing command

      let fields = [];
      if (command.aliases)
        fields.push({
          name: i18n.__("help.embeds.command.aliases"),
          value: `> \`${command.aliases.join("`, `")}\``,
        }); //If the command have aliases add field for it

      fields.push({
        name: i18n.__("help.embeds.command.usage"),
        value: i18n.__mf("help.embeds.command.usageValue", {
          usage: command.usage
            ? command.name + " " + command.usage
            : command.name,
        }),
      }); //Field for command usage

      fields.push({
        name: i18n.__("help.embeds.command.noPermissions"),
        value: i18n.__mf("help.embeds.command.noPermissionsValue", {
          permissions: command.permissions?.join("`, `") || "none",
          note:
            command.permissions &&
            !interaction.channel
              .permissionsFor(interaction.member)
              .has(command.permissions)
              ? i18n.__("help.embeds.command.noPermissionsNote")
              : "",
        }),
      }); //Field for required user permissions

      fields.push({
        name: i18n.__("help.embeds.command.noRunPermissions"),
        value: i18n.__mf("help.embeds.command.noRunPermissionsValue", {
          permissions: command.runPermissions?.join("`, `") || "none",
          note:
            command.runPermissions &&
            !interaction.channel
              .permissionsFor(client.user)
              .has(command.runPermissions)
              ? i18n.__("help.embeds.command.noRunPermissionsNote")
              : "",
        }),
      }); //Field for required bot permissions

      interaction.reply({
        embeds: [
          {
            title: command.name,
            description: command.description,
            timestamp: Date.now(),
            color: `${color}`,
            fields: fields,
            author: {
              name: interaction.guild.name,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            },
            footer: {
              text: interaction.user.tag,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            },
          },
        ],
      });
    }
  },
};
