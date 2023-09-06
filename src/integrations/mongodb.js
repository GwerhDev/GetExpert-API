const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config/config");

module.exports = class DB {
  static connect() {
    mongoose.Promise = global.Promise;
    return mongoose.connect(
      MONGODB_URI,
      { useNewUrlParser: true }
    )
  }
};