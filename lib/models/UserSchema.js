const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  role: { type: String, unique: true, required: true }
});

const systemdb = mongoose.connection.useDb("systemdb");
module.exports = systemdb.model("User", UserSchema);
