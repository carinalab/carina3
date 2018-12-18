var async = require("async");
var _ = require("lodash");
var async = require("async");
var Belief = require("../lib/models/Belief");
class Module1 {
  inputSensor(input) {
    switch (input.type) {
      case "text":
        this.getGrammaticalCategory(input);
        break;
      default:
    }

    //this.io.to(i.idClient).emit("inputResponse", { cg: i });
  }

  getGrammaticalCategory(input) {
    let words = input.text.split(" ");
    let arrCgr = [];
    async.eachOfSeries(words, (word, key, cbWord) => {
      Belief.find({ name: word }).exec((err, b) => {
        try {
          console.log(`${word} ${b[0].has.cgrText}`);
          arrCgr.push(b[0].has.cgrText);
        } catch (e) {
          console.log(`${word}`);
          Belief.create({ name: word });
          arrCgr.push(null);
        }
      });
      cbWord();
    });
  }

  addAddCgr() {
    Belief.find({ "has.cgrText": { $exists: false } }).exec((err, b) => {
      console.log(b);
    });
  }
}

exports.module1 = new Module1();
