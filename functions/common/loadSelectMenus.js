const fs = require("fs");

async function loadSelectMenus(client) {
  const selectMenuFolders = fs.readdirSync("./selectMenus");
  for (const folder of selectMenuFolders) {
    const selectMenuFiles = fs
      .readdirSync(`./selectMenus/${folder}`)
      .filter((file) => file.split(".").pop() === "js");
    for (const file of selectMenuFiles) {
      if (selectMenuFiles.length <= 0) {
        console.log("client couldn't find selectMenus in selectMenus folder.");
      } else {
        const selectMenu = require(`../../selectMenus/${folder}/${file}`);
        if (selectMenu.disabled) continue;
        client.selectMenus.set(selectMenu.customId, selectMenu);
      }
    }
  }
}

module.exports = {
  loadSelectMenus,
};
