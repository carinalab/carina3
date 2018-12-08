var async = require("async");
var _ = require("lodash");
var { BeliefSchema } = require("../lib/models/Belief");
var moment = require("moment");
var mongoose = require("mongoose");
var Belief = require("../lib/models/Belief");
var Domain = require("../lib/models/Domain");
var ObjectId = require("mongodb").ObjectID;

class Utilities {
  /**
   * @param {object} beliefs.
   */

  setDomain(words) {
    let arrBeliefs = [];
    var Belief = mongoose.model("Belief", BeliefSchema);
    console.log("connected");
    var i = 0;
    var eInsert = 0;
    var eAdd = 0;
    async.eachSeries(
      words.elements,
      (word, cbBelief) => {
        word = word.toLowerCase();
        Belief.find({ name: word }, function(err, r) {
          if (err) throw err;

          if (r.length == 0) {
            let id = new ObjectId();

            let belief = {
              _id: id,
              name: word
            };

            Belief.create(belief, function(err, b) {
              if (err) return handleError(err);
              console.log(
                `Blelief saved add to domain ${eInsert++}: ${eAdd++} ${word}`
              );
              arrBeliefs.push(id);
              cbBelief();
            });
          } else {
            arrBeliefs.push(r[0]._id);
            console.log(
              `Blelief is all ready exist, add to domain ${eAdd++}: ${
                r[0].name
              }`
            );
            cbBelief();
          }
        });
      },
      function(err) {
        let domain = {
          name: words.name,
          type: words.type,
          elements: arrBeliefs
        };

        Domain.create(domain, function(err, d) {
          if (err) return handleError(err);
          console.log(`Domain saved with ${arrBeliefs.length} beliefs`);
        });

        /*Update elements in domain
        Domain.update(
          { type: words.type },
          { $push: { elements: arrBeliefs } },
          { multi: true, upsert: true }
        ).exec((err, upd) => console.log(upd));*/
      }
    );
  }

  importBeliefv1Tov2(beliefs) {
    var tempBelief;

    async.eachOfSeries(
      beliefs,
      (belief, key, cbBelief) => {
        switch (belief.typeSmu) {
          case "SOE":
            tempBelief = {
              name: key,
              has: {
                typeSe: belief.tiene
              }
            };
            break;
          case "CGR":
            tempBelief = {
              name: key,
              has: {
                typeSmu: belief.typeSmu,
                form: belief.tiene.forma,
                numberText: belief.tiene.numero,
                cgrText: belief.tiene.tipo,
                lemaText: belief.tiene.lema,
                lexeme: belief.tiene.lexema,
                mode: belief.tiene.modo,
                person: belief.tiene.persona,
                subType: belief.tiene.subtipo,
                time: belief.tiene.tiempo
              }
            };
            break;
        }
        Belief.findOneAndUpdate(
          { name: key },
          tempBelief,
          { upsert: true, new: true, setDefaultsOnInsert: true },
          function(err, result) {
            if (err) throw err;
            cbBelief();
          }
        );
      },
      function(err) {}
    );
  }

  uploadBelief(beliefs) {
    mongoose
      .connect(
        //"mongodb+srv://carinaAdm:W1e2b3c4@cluster0-pc14x.mongodb.net/generic?retryWrites=true",
        "mongodb://localhost:27017/generic",
        { useCreateIndex: true, useNewUrlParser: true }
      )
      .then(() => {
        var Belief = mongoose.model("Belief", BeliefSchema);
        console.log("connected");
        var i = 0;
        async.eachSeries(
          beliefs,
          (belief, cbBelief) => {
            Belief.find({ name: belief.name }, function(err, result) {
              if (err) throw err;
              if (result.length == 0) {
                Belief.create(belief, function(err, b) {
                  if (err) return handleError(err);
                  console.log(`Blelief saved ${word} : ${i++}`);
                  cbBelief();
                });
              } else {
                console.log(`Blelief is all ready exist: ${belief.name}`);
                cbBelief();
              }
            });
          },
          function(err) {
            console.log(`Inserted all belief`);
          }
        );
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  downloadBelief() {
    Belief.find((err, beliefs) => {
      if (err) return res.status(500).json({ err: err });

      const dateTime = moment().format("YYYY-MM-DD-HH-mm");
      const filePath = path.join(
        __dirname,
        "backup",
        "carina-" + dateTime + ".json"
      );
      fs.writeFile(filePath, JSON.stringify(beliefs), function(err) {
        if (err) throw err;
        console.log(`File ${filePath} was created`);
        setTimeout(function() {
          fs.unlinkSync(filePath); // delete this file after 30 seconds
        }, 30000);
      });
    });
  }
  sendWordsAsBelief(words) {
    var Belief = mongoose.model("Belief", BeliefSchema);
    var i = 0;
    async.eachSeries(
      words.elements,
      (word, cbBelief) => {
        word = word.toLowerCase();
        Belief.find({ name: word }, function(err, result) {
          if (err) throw err;

          if (result.length == 0) {
            Belief.create({ name: word }, function(err, b) {
              if (err) return handleError(err);
              console.log(`Blelief saved ${i++} : ${word} `);
              cbBelief();
            });
          } else {
            console.log(`Blelief exist! ${i++} :  ${word}`);
            cbBelief();
          }
        });
      },
      function(err) {
        console.log(`Finish`);
      }
    );
  }
}
var util = new Utilities();
exports.util = util;
