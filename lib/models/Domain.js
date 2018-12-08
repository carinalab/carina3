const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DomainSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  type: String,
  elements: [
    {
      type: Schema.Types.ObjectId,
      ref: "Belief"
    }
  ]
});

var Domain = mongoose.model("Domain", DomainSchema);
module.exports = Domain;

/*
const systemdb = mongoose.connection.useDb("generic");
module.exports = systemdb.model("Domain", DomainSchema);
*/
