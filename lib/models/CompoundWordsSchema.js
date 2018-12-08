const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompoundWordsSchema = new Schema({
  type: String,
  name: {
    type: String,
    unique: true,
    required: true
  },
  checked: {
    type: String,
    default: "unsanctioned"
  },
  compound: [
    {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    }
  ],
  has: {
    gender: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    number: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    sCgr: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    cgr: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    lema: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    links: [
      {
        type: Schema.Types.ObjectId,
        ref: "Belief"
      }
    ],
    img: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    sound: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    }
  }
});

var CompoundWords = mongoose.model("CompoundWords", CompoundWordsSchema);
module.exports = CompoundWords;

/*
const systemdb = mongoose.connection.useDb("generic");
module.exports = systemdb.model("CompoundWords", CompoundWordsSchema);
*/
