'use strict';
var   mongoose = require('./mongoose');
 var Statsaving= function (namedata, namestats) {
   var doc;
  var Schema = mongoose.Schema;
  var schemadata =  new Schema({
    data : Array
  });
  var Modeldata = mongoose.model(namedata,schemadata);
  var schemastats =  new Schema({
    sigma : Array ,
    media : Array,
    N : Number,
  });
  schemastats.post('find', function(stats) {
    doc =
  });
  var Modelstats = mongoose.model(namestats,schemastats);

  this.create = function (tosave) {
    doc = new Modeldata(tosave);
    Modelstats.find({});
  };

};

module.exports.Statsaving = Statsaving;
