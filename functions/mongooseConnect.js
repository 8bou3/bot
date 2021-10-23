const { connect } = require("mongoose");

function mongooseConnect(path) {
  connect(path)
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
