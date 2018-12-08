const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeliefSchema = new Schema({
  type: String,
  name: {
    type: String,
    unique: true,
    required: true
  },
  isA: {
    type: [Schema.Types.ObjectId],
    ref: "Belief",
    default: []
  },
  attributes: {
    hyponym: [
      {
        type: Schema.Types.ObjectId,
        ref: "Belief"
      }
    ],
    synonym: [
      {
        type: Schema.Types.ObjectId,
        ref: "Belief"
      }
    ],
    holonym: [
      {
        type: Schema.Types.ObjectId,
        ref: "Belief"
      }
    ],
    antonym: [
      {
        type: Schema.Types.ObjectId,
        ref: "Belief"
      }
    ],
    meronym: [
      {
        type: Schema.Types.ObjectId,
        ref: "Belief"
      }
    ]
  },
  numAtt: {
    type: Number,
    default: 0
  },
  checked: {
    type: String,
    default: "unsanctioned"
  },
  subType: {
    type: String,
    default: null
  },
  typeSmu: {
    type: String,
    default: null
  },
  soe: {
    type: String,
    default: null
  },
  compounddWord: [
    {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    }
  ],
  isPartCompoundWord: [
    {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    }
  ],
  has: {
    typeSe: {
      type: Object,
      default: null
    },
    typeSmu: {
      type: String,
      default: null
    },
    form: {
      type: String,
      default: null
    },
    lexeme: {
      type: String,
      default: null
    },
    mode: {
      type: String,
      default: null
    },
    person: {
      type: String,
      default: null
    },
    subType: {
      type: String,
      default: null
    },
    time: {
      type: String,
      default: null
    },
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
    numberText: {
      type: String,
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
    cgrText: {
      type: String,
      default: null
    },
    lema: {
      type: Schema.Types.ObjectId,
      ref: "Belief",
      default: null
    },
    lemaText: {
      type: String,
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

var Belief = mongoose.model("Belief", BeliefSchema);
module.exports = Belief;

/*const systemdb = mongoose.connection.useDb("generic");
module.exports = systemdb.model("Belief", BeliefSchema);
module.exports = BeliefSchema;*/
