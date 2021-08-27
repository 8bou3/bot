module.exports = {
  name: "error",
  execute(error, client) {
    console.error(
      `${client.user.name}'s WebSocket encountered a connection error: ${error}`
    );
  },
};
