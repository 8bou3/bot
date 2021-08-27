module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.channels.cache.get("844694156844859392")?.send("**ready**");
    client.channels.cache.get("859957382435176519")?.send("**ready**");
  },
};
