async function editCommandReply(element, data, sent) {
  if (element.commandName) return await element.editReply(data);
  else return await sent.edit(data);
}

module.exports = {
  editCommandReply,
};
