var async = require("async");
var bcpu = require("../lib/temp/Bcpu");
var CompounddWord = require("../lib/models/CompoundWordsSchema");
var { domain } = require("./Domain");
var Belief = require("../lib/models/Belief");
var _ = require("lodash");
//import { recognition } from "./Recognition";

class Perception {
  postCognitiveModel(collection) {
    let contexto = collection.contexto;
    let palabrasClave = contexto.palabrasClave;
    let registros = collection.registros;

    async.eachSeries(
      registros,
      (registro, cbReg) => {
        async.autoInject(
          {
            eEFD: callback => {
              domain.extractEntityFromDomain(callback, registro);
            },
            cEOR: (eEFD, callback) => {
              domain.consolidateEntitiesFromRegister(callback, collection);
            },
            emitToClientEFD: (cEOR, callback) => {
              if (this.socket != undefined)
                this.socket.emit("returnDataWithKeyWords", collection);
              callback();
            }
          },
          err => {
            cbReg(null, registro);
          }
        );
      },
      err => {
        console.log(`${JSON.stringify(collection, null, 2)}`);
      }
    );
  }

  relationedWords(body) {
    console.log(body);
  }
}

exports.perception = new Perception();
