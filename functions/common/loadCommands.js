const fs = require("fs");

async function loadCommands(client) {
  const commandFolders = fs.readdirSync("./commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.split(".").pop() === "js");
    for (const file of commandFiles) {
      if (commandFiles.length <= 0) {
        console.log("client couldn't find commands in commands folder.");
      } else {
        const command = require(`../../commands/${folder}/${file}`);
        if (command.disabled) continue;
        client.commands.set(command.name, command);
      }
    }
  }
}

module.exports = {
  loadCommands,
};
