const Discord = require("discord.js");
const i18n = require("i18n");
const fs = require("fs");

module.exports = {
  name: "loadcommands",
  aliases: ["loadslash"],
  hidden: true,
  runPermissions: ["SEND_MESSAGES"],
  description: i18n.__("loadcommands.description"),
  async execute(interaction) {
    if ("617807550993268737" !== interaction.user.id) return;
    await interaction.deferReply();

    if (!interaction.client.application?.owner)
      await interaction.client.application?.fetch();

    let data = [];
    let hiddenData = [];
    let i = 0;

    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.split(".").pop() === "js");
      for (const file of commandFiles) {
        if (commandFiles.length > 0) {
          const command = require(`../../commands/${folder}/${file}`);
          const commandData = {
            name: command.name,
            description: command.description,
            options: command.options ? command.options : undefined,
          };
          i++;
          if (command.hidden || command.disabled) hiddenData.push(commandData);
          else data.push(commandData);
        }
      }
    }

    interaction.client.application?.commands.set(data);
    console.log(`Global commands: ${data.length}`);
    console.log(
      `${i} Slash commands loaded and will be updated within an hour`
    );
    interaction.editReply(i18n.__mf("loadcommands.loaded", { i: i }));

    interaction.client.guilds.cache
      .get("859171064679890974") //Spirit's Development server
      ?.commands.set(hiddenData);

    interaction.client.guilds.cache
      .get("856688268519276544") //Imagine a bot - Support server
      ?.commands.set(hiddenData);
  },
};
