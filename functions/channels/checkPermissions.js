const i18n = require("i18n");

function checkPermissions(interaction, channel, user, permissions, color, reply) {
  const boolean = channel.permissionsFor(user)?.has(permissions);
  if (boolean) return false;
  if (reply !== false)
    interaction.editReply({
      embeds: [
        {
          color: `${color ? color : "#000000"}`,
          description: i18n.__mf("embeds.noPermissions.description", {
            user: user.id,
            permissions: permissions.join("`, `"),
            channel: channel.id,
          }),
          title: i18n.__("embeds.noPermissions.title"),
        },
      ],
      ephemeral: true,
    });
  return true;
}

module.exports = {
  checkPermissions,
};
