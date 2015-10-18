'use strict';
var   mongoose = require('../mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var sche = {
  schemadata: new Schema({
  data: Array,
}),

  schemastats: new Schema({
    sigma: Array,
    media: Array,
    N: Array,
  }),
};

// Riemann module make the stats into de data
var Statsaving = function(namedata, namestats) {
  var Modeldata = mongoose.model(namedata, this.schemadata);
  var Modelstats = mongoose.model(namestats, this.schemastats);
  return function(tosave, cb) {
    var doc = new Modeldata(tosave);
    Modelstats.find({}, function(error, stats0) {
      var l = doc.data.length;
      console.log('l=', l);
      var stats = stats0[0];
      var sigma = _.clone(stats.sigma, true),
      media = _.clone(stats.media, true),
      N = _.clone(stats.N, true);
      console.log('stats0', stats);
      for (var i = 0; i < l; i++) {
        console.log('N=', N[i]);
        console.log('antes stats.media[i]', media[i]);
        console.log('antes stats.sigma[i]', sigma[i]);
        if (!N[i]) {N[i] = 0;}

        if (!sigma[i]) {sigma[i] = 0;}

        if (!media[i]) {media[i] = 0;}

        console.log('N=', N[i]);
        console.log('stats.media[i]', media[i]);
        media[i] = (media[i] * N[i] + doc.data[i]) / (N[i] + 1);
        console.log('stats.media[i]', media[i]);
        console.log('stats.sigma[i]', sigma[i]);
        sigma[i] = Math.sqrt((sigma[i] * sigma[i] * (N[i] - 1) +
        (doc.data[i] - media[i]) * (doc.data[i] - media[i])) /
        (N[i] + 1));
        console.log('stats.sigma[i]', sigma[i]);

        N[i] = N[i] + 1;
        console.log('N=', N[i]);
      }

      stats.sigma = sigma;
      stats.media = media;
      stats.N = N;
      stats.save(function() {
        doc.save(cb);
      });
    });
  };

};

module.exports = Statsaving.bind(sche);
