const fs = require("fs");

function loadEvents(client) {
  const eventFolders = fs.readdirSync('./events');
  for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.split(".").pop() === "js");
    for (const file of eventFiles) {
      if (eventFiles.length <= 0) {
        console.log("client couldn't find files in events folder.");
      } else {
        const event = require(`../../events/${folder}/${file}`);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    }
  }
  console.log("Events loaded");
}

module.exports = {
  loadEvents
};