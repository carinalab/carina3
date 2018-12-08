var { inputText } = require("../lib/inputText");
var stopWords = require("../lib/stopWords");
var bcpu = require("../lib/Bcpu");
var { stm } = require("../models/ShortTermMemory");
var async = require("async");
var belief = require("../models/Belief");
var Belief = require("../models/BeliefSchema");
var ods = require("./Ods");
var data = require("../models/data");
var CompounddWord = require("../models/CompoundWordsSchema");

class Recognition {
  constructor() {}

  copiedBuffer(res) {
    ods.dataAgent = this.dataAgent;
    async.autoInject(
      {
        gRJ: callback => {
          this.generateRecognitionJudgment(callback, bcpu.input);
        },
        rS: (gRJ, callback) => {
          this.retrieveSMU(callback);
        },
        sW: (rS, callback) => {
          this.stopWords(callback, res);
        }
      },
      (err, result) => {
        ods.odsDomain(res, result.sW);
      }
    );
  }

  generateRecognitionJudgment(cb, input) {
    let arrPatt = [];
    stm.bcpu.recognitionJugdment.bjudgment = [];
    console.log("generateRecognitionJudgment");

    async.each(
      input,
      (fact, cbR) => {
        let pattern = new RegExp("^[A-Za-z0-9]+$");
        let recognized = pattern.test(fact.name);
        let found = 0;
        let retrieve;
        if (fact.name != "")
          Belief.find({ name: fact.name }).exec((err, belief) => {
            if (belief.length == 0) {
              retrieve = false;
              Belief.create(data.getBeliefStructure({ name: fact.name }));
            } else {
              retrieve = true;
            }
          });

        let judment = retrieve && recognized ? "known" : "unknow";

        let judgment = {
          typeSMU: "reccognitionJudgment",
          tipo: "empty",
          subtipo: "empty",
          tiene: {
            judment: judment,
            input: fact.name
          }
        };

        stm.bcpu.recognitionJugdment.bjudgment.push(judgment);
        cbR();
      },
      (err, result) => {
        cb(null, result);
      }
    );
  }

  retrieveSMU(cb) {
    console.log("retrieveSMU");
    cb(null);
  }

  stopWords(cb, res) {
    let arrWords = [];
    async.eachSeries(
      bcpu.input,
      (i, cbIp) => {
        let name = i.name.toLowerCase();

        if (stopWords.indexOf(name) == -1) {
          arrWords.push(name);
          cbIp();
        } else {
          cbIp();
        }
      },
      (err, result) => {
        cb(null, arrWords);
      }
    );
  }
}
export const recognition = new Recognition();
