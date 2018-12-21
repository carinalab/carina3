var async = require("async");
var _ = require("lodash");
var { date } = require("./Date");
var DomainSh = require("../lib/models/Domain");

class Domain {
  //extrae “dependencias”, “lugares”, “personas” “preguntas” y “fechas”
  extractEntityFromDomain(cbEEFD, reg) {
    let res = reg.respuesta;
    let sol = reg.solicitud;

    async.autoInject(
      {
        //get entityt respuesta from domain
        gERFD: cb => {
          let d = [
            { type: "@DEPENDENCIES", path: "dependencias" },
            { type: "@PLACES", path: "lugares" },
            { type: "@OWN_NAMES_SURNAMES", path: "personas" },
            { type: "@INTERROGATIVE_SENTENCES", path: "preguntas" },
            { type: "@DATE", path: "fechas" }
          ];
          console.time("gERFD");
          this.getEntityFromDomains(cb, reg, res, "entidadesRespuesta", d);
        },
        //remove entity from result
        rEFRR: (gERFD, cb) => {
          console.timeEnd("gERFD");
          console.time("rEFRR");
          this.removeEntityFromResult(cb, gERFD, {
            entidad: "entidadesRespuesta",
            path: "miscelaneas"
          });
        },
        //get entityt solicitud from domain
        gESFD: (rEFRR, cb) => {
          console.timeEnd("rEFRR");
          console.time("gESFD");
          let d = [
            { type: "@DEPENDENCIES", path: "dependencias" },
            { type: "@PLACES", path: "lugares" },
            { type: "@OWN_NAMES_SURNAMES", path: "personas" },
            { type: "@INTERROGATIVE_SENTENCES", path: "preguntas" },
            { type: "@DATE", path: "fechas" }
            //{ type: "@CONJUGATED_VERBS", path: "verbos" }
          ];
          console.time("getEntityFromDomains2");
          this.getEntityFromDomains(cb, reg, sol, "entidadesSolicitud", d);
        },
        //remove entity from result
        rEFRS: (gESFD, cb) => {
          console.timeEnd("gESFD");
          console.time("rEFRS");
          this.removeEntityFromResult(cb, gESFD, {
            entidad: "entidadesSolicitud",
            path: "miscelaneas"
          });
        }
      },
      (err, result) => {
        console.timeEnd("rEFRS");
        cbEEFD(null, result);
      }
    );
  }

  removeEntityFromResult(cb, gERFD, domain) {
    let e = gERFD[domain.entidad];
    let eSol = _.compact(
      _.concat(e.fechas, e.dependencias, e.lugares, e.preguntas)
    );
    let respuesta = gERFD.respuesta;

    eSol.map(w => (respuesta = _.replace(respuesta, w, "")));
    this.remStopWords(cb, respuesta, gERFD, domain);
  }

  remStopWords(cb, source, gERFD, domain) {
    let elements = [];
    DomainSh.find({
      type: {
        $in: [
          "@STOP_WORDS",
          "@GREETINGS",
          "@FAREWELLS",
          "@VERBS",
          //"@CONJUGATED_VERBS",
          "@ADVERBS_OF_TIME",
          "@ADVERBS_OF_PLACE",
          "@POSSESSIVE_ADJETIVES"
        ]
      }
    })
      .populate("elements", "name -_id")
      .exec((err, d) => {
        if (d.length != 0) {
          let arrKeyWords = [];
          d.map(o => {
            o.elements.map(e => arrKeyWords.push(e));
          });

          source
            .toLowerCase()
            .split(" ")
            .forEach(w => {
              if (!_.some(arrKeyWords, { name: w })) {
                elements.push(w);
              }
            });

          _.set(gERFD, `${domain.entidad}.${domain.path}`, _.compact(elements));
          cb(null, gERFD);
        }
      });
  }

  getEntityFromDomains(callback, registro, source, entidad, domains) {
    async.eachSeries(
      domains,
      (domain, cbDom) => {
        if (domain.type != "@DATE") {
          DomainSh.find({ type: domain.type })
            .populate("elements", "name -_id")
            .exec((err, d) => {
              let elements = [];
              let removeWords = [];

              if (d.length != 0) {
                source.split(" ").forEach(w => {
                  if (_.some(d[0].elements, { name: w })) {
                    elements.push(w);
                  } else removeWords.push(w);
                });

                _.set(registro, `${entidad}.${domain.path}`, elements);
                _.set(registro, `palabrasDescartadas`, removeWords);
                cbDom(null);
              } else {
                cbDom(null);
              }
            });
        } else {
          _.set(registro, `${entidad}.${domain.path}`, date.getDate(source));
          cbDom(null);
        }
      },
      err => {
        callback(null, registro);
      }
    );
  }

  consolidateEntitiesFromRegister(callback, collection) {
    let contexto = collection.contexto;
    let entidades = collection.entidades;
    let registros = collection.registros;

    //palabras descartadas, candidatas
    let arrPalDesc = [];
    let arrPalCan = [];
    let arrEntLugares = [];
    let arrEntFechas = [];
    let arrEntOrganizaciones = [];
    let arrEntPersonas = [];
    let arrEntMiscelaneas = [];
    let arrEntPreguntas = [];
    let arrEntVerbosDelDominio = [];

    registros.forEach(registro => {
      arrEntFechas = _.compact(
        _.concat(
          registro.entidadesSolicitud.fechas,
          registro.entidadesRespuesta.fechas
        )
      );

      arrEntLugares = _.compact(
        _.concat(
          registro.entidadesSolicitud.lugares,
          registro.entidadesRespuesta.lugares
        )
      );

      arrEntOrganizaciones = _.compact(
        _.concat(
          registro.entidadesSolicitud.organizaciones,
          registro.entidadesRespuesta.organizaciones
        )
      );

      arrEntPersonas = _.compact(
        _.concat(
          registro.entidadesSolicitud.personas,
          registro.entidadesRespuesta.personas
        )
      );

      arrEntMiscelaneas = _.compact(
        _.concat(
          registro.entidadesSolicitud.miscelaneas,
          registro.entidadesRespuesta.miscelaneas
        )
      );

      arrEntPreguntas = _.compact(
        _.concat(
          registro.entidadesSolicitud.preguntas,
          registro.entidadesRespuesta.preguntas
        )
      );

      arrEntVerbosDelDominio = _.compact(
        _.concat(
          registro.entidadesSolicitud.verbos,
          registro.entidadesRespuesta.verbos
        )
      );

      arrPalDesc = registro.palabrasDescartadas;
    });

    arrPalCan = _.compact(
      _.concat(
        arrEntLugares,
        arrEntFechas,
        arrEntOrganizaciones,
        arrEntPersonas,
        arrEntMiscelaneas,
        arrEntPreguntas,
        arrEntVerbosDelDominio
      )
    );

    /*
      [
        "",
        "5 de diciembre de 2018,5 de diciembre",
        ",",
        "",
        "fecha,cierre,5,diciembre,fecha,cierre",
        "cuando",
        "pueden,informar,es,fecha,cierre,"
      ]
    */

    //compilation
    contexto.palabrasDescartadas = arrPalDesc;
    contexto.palabrasCandidatas = arrPalCan;
    entidades.Lugares = arrEntLugares;
    entidades.Fechas = arrEntFechas;
    entidades.Organizaciones = arrEntOrganizaciones;
    entidades.Personas = arrEntPersonas;
    entidades.Miscelaneas = arrEntMiscelaneas;
    entidades.Preguntas = arrEntPreguntas;
    entidades.VerbosDelDominio = arrEntVerbosDelDominio;

    callback(null, collection);
  }
}

exports.domain = new Domain();
