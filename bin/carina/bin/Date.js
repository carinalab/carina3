var _ = require("lodash");
class Date {
  constructor() {
    this.ddmmaaaa = new RegExp(
      "(?:3[01]|[12][0-9]|0?[1-9])([\\-/.])(0?[1-9]|1[1-2])\\1\\d{4}"
    ); //dd-mm-aaaa
    this.mmddaaaa = new RegExp(
      "(?:0?[1-9]|1[1-2])([\\-/.])(3[01]|[12][0-9]|0?[1-9])\\1\\d{4}"
    ); //mm-dd-aaaa
    this.aaaammdd = new RegExp(
      "\\d{4}([\\-/.])(0?[1-9]|1[1-2])\\1(3[01]|[12][0-9]|0?[1-9])"
    ); //aaaa-mm-dd
    this.ddmonthaaaa = new RegExp(
      "([1-3][0-9]|[1-9])\\sde\\s((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)\\sde\\s[1-2][0-9][0-9][0-9]"
    ); //dd de nombre_mes de aaaa
    this.ddmonth = new RegExp(
      "([1-3][0-9]|[1-9])\\sde\\s((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)"
    ); //dd de nombre_mes
    this.monthddaaaa = new RegExp(
      "((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)\\s([1-9]|[1-3][0-9])\\sde\\s[1-2][0-9][0-9][0-9]"
    ); //nombre_mes dd de aaaa
    this.monthdd = new RegExp(
      "((enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)|(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(\\.)?)\\s([1-9]|[1-3][0-9])"
    ); //nombre_mes dd
    this.datetime = new RegExp(
      "(mañana\\shoy|ayer|antier|pasado\\smañana|pr[ó|o]xima\\ssemana|semana\\spasada|este\\smes|pr[ó|o]ximo\\saño|año\\spasado|este\\saño|en\\seste\\smomento|ahora|final\\sde\\saño|fin\\sde\\saño|principio\\sde\\saño|mediados\\sdel\\saño)"
    );
  }

  getDate(prayers) {
    let retPrayers = [];
    if (this.ddmmaaaa.test(prayers))
      retPrayers.push(_.values(this.ddmmaaaa.exec(prayers))[0]);
    if (this.mmddaaaa.test(prayers))
      retPrayers.push(_.values(this.mmddaaaa.exec(prayers))[0]);
    if (this.aaaammdd.test(prayers))
      retPrayers.push(_.values(this.aaaammdd.exec(prayers))[0]);
    if (this.ddmonthaaaa.test(prayers))
      retPrayers.push(_.values(this.ddmonthaaaa.exec(prayers))[0]);
    if (this.ddmonth.test(prayers))
      retPrayers.push(_.values(this.ddmonth.exec(prayers))[0]);
    if (this.monthddaaaa.test(prayers))
      retPrayers.push(_.values(this.monthddaaaa.exec(prayers))[0]);
    if (this.monthdd.test(prayers))
      retPrayers.push(_.values(this.monthdd.exec(prayers))[0]);
    if (this.datetime.test(prayers))
      retPrayers.push(_.values(this.datetime.exec(prayers))[0]);
    return retPrayers;
  }
}

exports.date = new Date();
