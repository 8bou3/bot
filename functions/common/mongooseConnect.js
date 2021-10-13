const mongoose = require("mongoose");
const config = require("../../config.js");

function mongooseConnect() {
  mongoose
    .connect(config.mongoPath)
    .then(() => {
      console.log("Connected to mongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  mongooseConnect,
};
