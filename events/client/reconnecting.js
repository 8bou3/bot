module.exports = {
  name: "reconnecting",
  execute(client) {
    console.log(`${client.user.tag} tries to reconnect to the WebSocket`);
  },
};
