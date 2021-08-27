const mongoose = require("mongoose");
const config = require("../../config.js");

function mongooseConnect() {
  mongoose
    .connect(config.mongoPath, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
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
