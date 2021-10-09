const i18n = require('i18n')

module.exports = {
  name: 'syncslowmode',
  usage: '<boolean: toggle>',
  permissions: ['MANAGE_THREADS'],
  runPermissions: ['EMBED_LINKS', 'SEND_MESSAGES', 'MANAGE_THREADS'],
  description: i18n.__('syncslowmode.description'),
  options: [
    {
      type: 5,
      name: 'boolean',
      description: 'True: on, false: off'
    }
  ],
  async execute (interaction, Data) {
    let toggle = interaction.options.getBoolean('boolean')
    if (toggle === null)
      toggle = Data.channel.threads.syncSlowmode ? false : true

    Data.channel.threads.syncSlowmode = toggle
    await Data.channel.save()

    interaction.editReply(`Sync slowmode \`${toggle}\``)
  }
}
