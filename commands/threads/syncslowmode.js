module.exports = {
  name: "syncslowmode",
  usage: "<boolean: toggle>",
  permissions: ["MANAGE_THREADS"],
  runPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "MANAGE_THREADS"],
  description: i18n.__("threads.description"),
  options: [
    {
      type: 5,
      name: "boolean",
      description: "True: on, false: off",
    },
  ],
  execute(interaction, Data) {
    let toggle = interaction.options.getBoolean("boolean")
      ? interaction.options.getBoolean("boolean")
      : Data.channel.threads.syncSlowmode
      ? false
      : true;
    
    if (toggle) {
      Data.channel.threads.syncSlowmode = undefined
      await Data.channel.save()
      
      interaction.editReply("Sync slowmode off")
    } else {
      Data.channel.threads.syncSlowmode = true
      await Data.channel.save()
      
      interaction.editReply("Sync slowmode on")
    }
  },
};
