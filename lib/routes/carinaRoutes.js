/*routes.js Alexander Toscano Ricardo*/
var { carina } = require("../../bin/carina/Carina");
var vt = require("../config/validateToken");
var app;
module.exports = function(params) {
  ({ app, io } = params);
  io.on("connection", function(socket) {
    console.log(`A client connect! id: ${socket.id}`);
    carina.io = io;
    carina.socket = socket;
    carina.socket.emit("clientConnect", { idClient: socket.id });
    carina.activeOnSocket();
  });

  app.get("/c", (req, res) => {
    res.send({ version: carina._version });
  });

  app.post("/c/relationedWords", vt, (req, res) => {
    let body = req.body;
    carina.relationedWords(body);
    res.status(200).send({ message: "Relationed words sended!" });
  });

  app.post("/c/postCognitiveModel", vt, (req, res) => {
    let body = req.body;
    carina.postCognitiveModel(body);
    res.status(200).send({ message: "Cognitive model sended!" });
  });

  app.post("/c/inputSensor", vt, (req, res) => {
    let body = req.body;
    carina.inputSensor(body);
    res.status(200).send({ message: "Input sended!" });
  });

  app.get("/c/addCgr", vt, (req, res) => {
    carina.addAddCgr();
    res.status(200).send({ message: "Cgr sended!" });
  });

  app.post("/c/uploadBelief", vt, (req, res) => {
    let body = req.body;
    carina.uploadBelief(body);
    res.status(200).send({ message: "Input sended!" });
  });

  app.get("/c/downloadBelief", vt, (req, res) => {
    carina.downloadBelief();
    res.status(200).send({ message: "Backup downloaded!" });
  });

  app.post("/c/importBeliefv1Tov2", vt, (req, res) => {
    let body = req.body;
    carina.importBeliefv1Tov2(body);
    res.status(200).send({ message: "Belief recived!" });
  });

  app.post("/c/compoundWord", vt, (req, res) => {
    let body = req.body;
    carina.compoundWord(body);
    res.status(200).send({ message: "Words recived!" });
  });

  app.post("/c/setDomain", vt, (req, res) => {
    let body = req.body;
    carina.setDomain(body);
    res.status(200).send({ message: "Domains recived!" });
  });

  app.post("/c/sendWordsAsBelief", vt, (req, res) => {
    let body = req.body;
    carina.sendWordsAsBelief(body);
    res.status(200).send({ message: "Words recived!" });
  });
};
