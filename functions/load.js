//channels
const { checkPermissions } = require("./channels/checkPermissions");

//common
const { i18nConfigure } = require("./common/i18nConfigure");
const { loadCommands } = require("./common/loadCommands");
const { loadEvents } = require("./common/loadEvents");
const { mongooseConnect } = require("./common/mongooseConnect");

module.exports = {
  checkPermissions,
  i18nConfigure,
  loadCommands,
  loadEvents,
  mongooseConnect,
};
