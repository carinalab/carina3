/* Carina.js file  Alexander Toscano Ricardo */
var { socket, io } = require("../../lib/config/sockets.js");
var async = require("async");
var _ = require("lodash");
var { util } = require("./bin/Utilities");
var { perception } = require("./bin/Perception");
/**
 * {{Carina}}
 * @version 3.0
 */
class Carina {
  /**
   * @param {string} v - this is a version.
   */
  constructor(v) {
    console.log("Carina run");
    this._version = v;
  }

  postCognitiveModel(body) {
    perception.io = this.io;
    perception.socket = this.socket;
    perception.postCognitiveModel(body);
  }

  relationedWords(body) {
    perception.io = this.io;
    perception.socket = this.socket;
    perception.relationedWords(body);
  }
  /** carga de nuevo modelo cognitivo
   * @param {object} i - this is a sensor input
   */
  inputSensor(i) {
    perception.io = this.io;
    perception.readStimulus(i);
  }
  setDomain(words) {
    util.setDomain(words);
  }
  addAddCgr() {
    module1.addAddCgr();
  }

  uploadBelief(beliefs) {
    util.uploadBelief(beliefs);
  }

  downloadBelief() {
    util.downloadBelief();
  }
  /**
   * @param {object} beliefs.
   */
  importBeliefv1Tov2(beliefs) {
    util.importBeliefv1Tov2(beliefs);
  }
  sendWordsAsBelief(words) {
    util.sendWordsAsBelief(words);
  }
  /**
   * @param {object} words.
   */
  compoundWord(words) {
    //util.compoundWord(words);
  }

  /**
   * @return {string} return version.
   */
  get version() {
    return this._version;
  }

  activeOnSocket() {
    this.socket.on("sendMessage", data => {
      console.log(data);
    });
  }
}
/** Instance of Carina*/
var carina = new Carina("3.0.0");

/** Export Carina */
exports.carina = carina;
