var mongoose = require("mongoose");
var { conf } = require("./config/apirest");
var path = require("path");
/** databases of APIREST*/
class Database {
  /** constructor */
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect(
        "mongodb://localhost:27017/carinaGeneric", //carina:cicc0118@
        //uri,
        //"mongodb+srv://carinaAdmin:OReAxNumDHnEGpFD@cluster0-cufc4.mongodb.net/carinaGeneric?retryWrites=true",
        { useNewUrlParser: true }
      );
      console.log("Connected databases.");
    } catch (e) {
      console.error(e);
    }
  }
}

/** export database */
exports.database = new Database();
