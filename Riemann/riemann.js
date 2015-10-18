'use strict';
var   mongoose = require('../mongoose');
var Schema = mongoose.Schema;
var schemadata =  new Schema({
  data: Array,
});

var schemastats =  new Schema({
    sigma: Array,
    media: Array,
    N: Array,
  });

// Riemann module make the stats into de data
var Statsaving = function(namedata, namestats) {
  var Modeldata = mongoose.model(namedata, schemadata);
  var Modelstats = mongoose.model(namestats, schemastats);
  return function(tosave, cb) {
    var doc = new Modeldata(tosave);
    Modelstats.find({}, function(error, stats) {
      if (error) {
        console.log('error into save doc = ', error); return;
      }

      var l = stats.length;
      for (var i = 0; i < l; i++) {
        stats.media[i] = (stats.media[i] * stats.N[i] + doc.data[i]) / (stats.N[i] + 1);
        stats.sigma[i] = Math.sqrt((stats.sigma[i] * stats.sigma[i] * (stats.N[i] - 1) + (doc.data[i] - stats.media[i]) * (doc.data[i] - stats.media[i])) / (stats.N[i]));
        (stats.N[i])++;
      }

      doc.save(function(err) {
        if (err) {
          console.log('error into save doc = ', err); return;
        }

        stats.save(cb);
      });
    });
  };

};

module.exports = Statsaving;
