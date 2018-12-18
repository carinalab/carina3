var async = require("async");
var bcpu = require("../lib/temp/Bcpu");
var CompounddWord = require("../lib/models/CompoundWordsSchema");
var Belief = require("../lib/models/Belief");
var Domain = require("../lib/models/Domain");
var _ = require("lodash");
//import { recognition } from "./Recognition";

class Perception {
  postCognitiveModel(collection) {
    //console.log(JSON.stringify(collection));
    let contexto = collection.contexto;
    let palabrasClave = contexto.palabrasClave;
    let registros = collection.registros;

    async.eachSeries(
      registros,
      (objRegistros, cbVa) => {
        async.autoInject(
          //respuestas
          {
            verifyAnswers: callback => {
              let arrPrayers = objRegistros.respuesta.split(".");
              _.set(
                objRegistros,
                "entidadesRespuesta.fecha",
                this.extractDate(arrPrayers)
              );
              let miscellaneous = objRegistros.respuesta.toLowerCase();
              _.set(
                objRegistros,
                `entidadesRespuesta.miscelaneas`,
                miscellaneous
              );
              callback();
            },
            getPeoplesFromDomain: (verifyAnswers, callback) => {
              this.selFromDomain(
                callback,
                ["@OWN_NAMES_SURNAMES"],
                objRegistros,
                objRegistros.respuesta,
                "personas",
                "entidadesRespuesta"
              );
            },
            getInterSentFromDomain: (getPeoplesFromDomain, callback) => {
              this.selFromDomain(
                callback,
                ["@INTERROGATIVE_SENTENCES"],
                objRegistros,
                objRegistros.respuesta,
                "preguntas",
                "entidadesRespuesta"
              );
            },
            //solicitud
            verifyRequst: (getInterSentFromDomain, callback) => {
              let arrPrayers = objRegistros.solicitud.split(".");
              _.set(
                objRegistros,
                "entidadesSolicitud.fecha",
                this.extractDate(arrPrayers)
              );
              callback();
            },
            getPeoplesFromDomainResponse: (verifyRequst, callback) => {
              this.selFromDomain(
                callback,
                ["@OWN_NAMES_SURNAMES"],
                objRegistros,
                objRegistros.solicitud,
                "personas",
                "entidadesSolicitud"
              );
            },
            getInterSentFromDomainResponse: (
              getPeoplesFromDomainResponse,
              callback
            ) => {
              this.selFromDomain(
                callback,
                ["@INTERROGATIVE_SENTENCES"],
                objRegistros,
                objRegistros.solicitud,
                "preguntas",
                "entidadesSolicitud"
              );

              let miscellaneous = objRegistros.solicitud.toLowerCase();
              _.set(
                objRegistros,
                `entidadesSolicitud.miscelaneas`,
                miscellaneous
              );
            }
          },
          err => {
            //entidad respuesta
            let miscelaneas = _.get(
              objRegistros,
              `entidadesRespuesta.miscelaneas`
            );
            _.concat(
              _.get(objRegistros, `entidadesRespuesta.fecha`),
              _.get(objRegistros, `entidadesRespuesta.personas`),
              _.get(objRegistros, `entidadesRespuesta.preguntas`),
              _.get(objRegistros, `entidadesRespuesta.lugares`)
            ).map(f => {
              miscelaneas = _.replace(miscelaneas, f, "");
            });
            this.removeStopWords(
              null,
              objRegistros,
              miscelaneas,
              "entidadesRespuesta"
            );
            //entidad solicitud
            miscelaneas = _.get(objRegistros, `entidadesRespuesta.miscelaneas`);
            _.concat(
              _.get(objRegistros, `entidadesRespuesta.fecha`),
              _.get(objRegistros, `entidadesRespuesta.personas`),
              _.get(objRegistros, `entidadesRespuesta.preguntas`),
              _.get(objRegistros, `entidadesRespuesta.lugares`)
            ).map(f => {
              miscelaneas = _.replace(miscelaneas, f, "");
            });

            this.removeStopWords(
              cbVa,
              objRegistros,
              miscelaneas,
              "entidadesSolicitud"
            );
          }
        );
      },
      err => {
        //console.log(`${JSON.stringify(collection, null, 2)}`);
        if (this.socket != undefined)
          this.socket.emit("returnDataWithKeyWords", collection);
      }
    );
  }

  removeStopWords(cbVa, objRegistros, miscelaneas, entidad) {
    Domain.find({
      type: {
        $in: [
          "@STOP_WORDS",
          "@GREETINGS",
          "@VERBS",
          "@ADVERBS_OF_PLACE",
          "@ADVERBS_OF_TIME",
          "@POSSESSIVE_ADJETIVES"
        ]
      }
    })
      .populate("elements", "name -_id")
      .exec((err, dom) => {
        //console.log(JSON.stringify(dom[0].elements.map(e => e.name), null, 2));
        let stopWords = _.concat(
          dom[0].elements.map(e => e.name),
          dom[1].elements.map(e => e.name),
          dom[2].elements.map(e => e.name),
          dom[3].elements.map(e => e.name),
          dom[4].elements.map(e => e.name),
          dom[5].elements.map(e => e.name)
        );
        //console.log(JSON.stringify(stopWords));
        let elements = [];
        let removeWords = [];
        let words = miscelaneas.split(" ");
        words.forEach(w => {
          if (!_.some(stopWords, { name: w })) elements.push(w);
          else removeWords.push(w);
        });
        console.log(entidad, elements, removeWords);
        _.set(objRegistros, `${entidad}.miscelaneas`, _.compact(elements));
        if (cbVa != null) cbVa();
      });
  }

  selFromDomain(cbGetDom, domains, objRegistros, wordsExt, field, entidad) {
    let words = wordsExt.toLowerCase().split(" ");
    let miscellaneous = wordsExt.toLowerCase();
    let elements = [];

    Domain.find({ type: domains })
      .populate("elements", "name -_id")
      .exec((err, domain) => {
        if (domain.length != 0) {
          words.forEach(w => {
            if (_.some(domain[0].elements, { name: w })) elements.push(w);
          });
          _.set(objRegistros, `${entidad}.${field}`, elements);
          _.set(objRegistros, `${entidad}.miscelaneas`, miscellaneous);
          cbGetDom(null);
        } else {
          cbGetDom(null);
        }
      });
  }

  extractDate(arrPrayers) {
    let retPrayers = [];
    let f1 = new RegExp(
      "(?:3[01]|[12][0-9]|0?[1-9])([\\-/.])(0?[1-9]|1[1-2])\\1\\d{4}"
    ); //dd-mm-aaaa
    let f2 = new RegExp(
      "(?:0?[1-9]|1[1-2])([\\-/.])(3[01]|[12][0-9]|0?[1-9])\\1\\d{4}"
    ); //mm-dd-aaaa
    let f3 = new RegExp(
      "\\d{4}([\\-/.])(0?[1-9]|1[1-2])\\1(3[01]|[12][0-9]|0?[1-9])"
    ); //aaaa-mm-dd
    let f4 = new RegExp(
      "([1-3][0-9]|[1-9])\\sde\\s((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)\\sde\\s[1-2][0-9][0-9][0-9]"
    ); //dd de nombre_mes de aaaa
    let f5 = new RegExp(
      "([1-3][0-9]|[1-9])\\sde\\s((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)"
    ); //dd de nombre_mes
    let f6 = new RegExp(
      "((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)\\s([1-9]|[1-3][0-9])\\sde\\s[1-2][0-9][0-9][0-9]"
    ); //nombre_mes dd de aaaa
    let f7 = new RegExp(
      "((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)\\s([1-9]|[1-3][0-9])"
    ); //nombre_mes dd
    let f8 = new RegExp(
      "(mañana\\shoy|ayer|antier|pasado\\smañana|pr[ó|o]xima\\ssemana|semana\\spasada|este\\smes|pr[ó|o]ximo\\saño|año\\spasado|este\\saño|en\\seste\\smomento|ahora|final\\sde\\saño|fin\\sde\\saño|principio\\sde\\saño|mediados\\sdel\\saño)"
    );

    arrPrayers.forEach((prayers, i) => {
      if (f1.test(prayers)) retPrayers.push(_.values(f1.exec(prayers))[0]);
      if (f2.test(prayers)) retPrayers.push(_.values(f2.exec(prayers))[0]);
      if (f3.test(prayers)) retPrayers.push(_.values(f3.exec(prayers))[0]);
      if (f4.test(prayers)) retPrayers.push(_.values(f4.exec(prayers))[0]);
      if (f5.test(prayers)) retPrayers.push(_.values(f5.exec(prayers))[0]);
      if (f6.test(prayers)) retPrayers.push(_.values(f6.exec(prayers))[0]);
      if (f7.test(prayers)) retPrayers.push(_.values(f7.exec(prayers))[0]);
      if (f8.test(prayers)) retPrayers.push(_.values(f8.exec(prayers))[0]);
    });
    return retPrayers;
  }
}

exports.perception = new Perception();
