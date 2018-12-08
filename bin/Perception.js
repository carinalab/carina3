var async = require("async");
var bcpu = require("../lib/temp/Bcpu");
var CompounddWord = require("../lib/models/CompoundWordsSchema");
var Belief = require("../lib/models/Belief");
var Domain = require("../lib/models/Domain");
var _ = require("lodash");
//import { recognition } from "./Recognition";

class Perception {
  postCognitiveModel(collection) {
    //({ context, csv } = body);
    let context = collection.context;
    let palabrasClave = context.palabrasClave;
    let csv = collection.csv;

    async.autoInject(
      {
        stopWords: callback => {
          this.getDomain(callback, "@STOP_WORDS");
        },
        extractKeywords: (stopWords, callback) => {
          let objKeyWords = {};
          let lengthCsv = csv.length;
          let i = 0;
          async.eachSeries(
            csv,
            (objCsv, cbEw) => {
              //removemos stopwords y eliminamos palabras repetidas
              let filSol = this.removeDomain(objCsv.solicitud, stopWords);
              let filRes = this.removeDomain(objCsv.respuesta, stopWords);

              let candidateWords = _.uniqWith(
                _.concat(filSol.candidateWords, filRes.candidateWords),
                _.isEqual
              );

              let removeWords = _.uniqWith(
                _.concat(filSol.removeWords, filRes.removeWords)
              );
              //adicionamos a cada registro sus palabras candidatas
              objCsv.candidateWords = candidateWords;
              objCsv.removeWords = removeWords;

              context.palabrasCandidatas = _.concat(
                context.palabrasCandidatas,
                candidateWords
              );

              context.palabrasDescartadas = _.concat(
                context.palabrasDescartadas,
                removeWords
              );

              _.set(objKeyWords, `objCsv[${i}]`, objCsv);
              i++;
              let percent = (i * 100) / lengthCsv;
              if (this.socket != undefined)
                this.socket.emit("progressDataWithKeyWords", {
                  item: i,
                  items: lengthCsv,
                  percent: percent
                });
              //console.log(`${i} to ${lengthCsv} (${percent}%)`);
              cbEw();
            },
            function(err) {
              collection.context.palabrasCandidatas = _.uniqWith(
                collection.context.palabrasCandidatas,
                _.isEqual
              );
              collection.context.palabrasDescartadas = _.uniqWith(
                collection.context.palabrasDescartadas,
                _.isEqual
              );
              callback(null, collection);
            }
          );
        }
      },
      (err, result) => {
        console.log(`${JSON.stringify(collection, null, 2)}`);
        if (this.socket != undefined)
          this.socket.emit("returnDataWithKeyWords", collection);
      }
    );
  }

  /*  @POSSESSIVE_ADJETIVES, @VERBS, @ADVERBS_OF_PLACE, @ADVERBS_OF_TIME,
      @SURNAMES, @COMPOUND_WORDS, @FAREWELLS, @OWN_NAMES, @GREETINGS */
  getDomain(cbGetDom, domain) {
    Domain.find({ type: domain })
      .populate("elements", "name -_id")
      .exec((err, domain) => {
        let words = domain[0].elements.map(v => v.name);
        cbGetDom(null, words);
      });
  }

  removeDomain(words, domain) {
    let removeWords = [];
    let candidateWords = _.compact(
      _.split(words, " ").map(word => {
        if (domain.indexOf(word.toLowerCase()) == -1) return word.toLowerCase();
        else removeWords.push(word.toLowerCase());
      })
    );
    return { removeWords: removeWords, candidateWords: candidateWords };
  }

  relationWords() {}

  /*extractKeywords(cbeKW, palabrasClave, csv) {
    let objKeyWords = {};
    let i = 0;
    async.eachSeries(
      csv,
      (objCsv, cbEw) => {
        let arrKeyWords = [];
        palabrasClave.forEach(palabra => {
          if (objCsv.peticion.includes(palabra)) arrKeyWords.push(palabra);
        });
        objCsv.keywords = arrKeyWords;
        cbEw();
        _.set(objKeyWords, `objCsv[${i}]`, objCsv);
        i++;
      },
      err => {
        console.log(`each series: ${JSON.stringify(objKeyWords, null, 2)}`);
        cbeKW(null, objKeyWords);
      }
    );
  }

  readStimulus(i) {
    console.log(`readStimulus`);

    var type = i.type;
    var text = i.text;

    async.autoInject(
      {
        rSFE: callback => {
          this.readStimulusFromEnvironment(callback);
        },
        /*eCW: callback => {
          this.extractCompoundWord(callback);
        }
        eWFP: callback => {
          // se debe enviar el callback a la funcion y luego retornar
          //let arrWords = await text.peticion.split(" ");
          callback(null, arrWords);
        } ,
        eSMU: (rECW, callback) => {
          this.encodeSMU(callback, rECW);
        },
        sSIS: (eSMU, callback) => {
          this.saveSMUIntoSSM(callback, eSMU);
        },
        cBSSSB: (sSIS, callback) => {
          this.copyBufferSSMFromSelectedSensorIntoBCPUInput(callback, sSIS);
        }
      },
      (err, results) => {
        console.log(result);
        //recognition.copiedBuffer(res);
      }
    );
  }

  readStimulusFromEnvironment(cb) {
    console.info("readStimulusFromEnvironment");
    cb(null);
  }

  extractCompoundWord(cb) {
    console.log("extractCompoundWord");
    let arrCompoundWord = [];
    let input = this.sensor.wordTextPerceptor;
    return CompounddWord.find()
      .select("has.lema name")
      .exec((err, cw) => {
        async.eachSeries(
          cw,
          (w, cbw) => {
            let name = w.name;
            let exp = new RegExp(`${name}`);
            if (exp.test(input) == true) {
              input = input.replace(name, "");
              arrCompoundWord.push(name);
              cbw();
            } else {
              cbw();
            }
          },
          err => {
            cb(null, { cw: arrCompoundWord, in: input });
          }
        );
      });
  }

  encodeSMU(cb, rECW) {
    console.info("encodeSMU");
    let arrBelief = [];
    async.eachSeries(
      rECW,
      (word, callback) => {
        arrBelief.push(new Belief(word, null, null, null));
        callback();
      },
      err => {
        this.sensor.stackBufferSMU = arrBelief;
        cb(null, arrBelief);
      }
    );
  }
  saveSMUIntoSSM(cb, stackBufferSMU) {
    cb(null, stackBufferSMU);
  }
  copyBufferSSMFromSelectedSensorIntoBCPUInput(cb, buffer) {
    console.info("copyBufferSSMFromSelectedSensorIntoBCPUInput");
    //bcpu.input = buffer;
    //cb(null, bcpu.input);
    cb(null, buffer);
  }*/
}

exports.perception = new Perception();
