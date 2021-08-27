//channels
const { checkPermissions } = require("./channels/checkPermissions");
const { getTextChannel } = require("./channels/getTextChannel");

//common
const { i18nConfigure } = require("./common/i18nConfigure");
const { loadCommands } = require("./common/loadCommands");
const { loadEvents } = require("./common/loadEvents");
const { mongooseConnect } = require("./common/mongooseConnect");

//messages
const { awaitAutherMessages } = require("./messages/awaitAutherMessages");
const { editCommandReply } = require("./messages/editCommandReply");

module.exports = {
  checkPermissions,
  getTextChannel,
  i18nConfigure,
  loadCommands,
  loadEvents,
  mongooseConnect,
  awaitAutherMessages,
  editCommandReply,
};
