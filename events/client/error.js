module.exports = {
  name: "error",
  execute(error, client) {
    console.log(
      `${client.user.name}'s WebSocket encountered a connection error: ${error}`
    );
  },
};
