'use strict';
var   mongoose = require('../mongoose');
var Schema = mongoose.Schema;
var random = require('../Noether/noether').plugin;
var _ = require('lodash');
var schemadata = new Schema({
  data: Array,
});
var schemastats = new Schema({
  sigma: Array,
  media: Array,
  N: Array,
});
schemadata.plugin(random);
schemastats.plugin(random);
var Modeldata  = mongoose.model('data', schemadata);
var Modelstats  = mongoose.model('stats', schemastats);

// Riemann module make the stats into de data when the doc is sa
var Statsaving = function() {
  this.Modeldata  = Modeldata;
  this.Modelstats  = Modelstats;
  var create = function(tosave, cb) {
    var doc = new this.Modeldata(tosave);
    this.Modelstats.find({}, function(error, stats0) {
      var l = doc.data.length;

      var stats = stats0[0];
      var sigma = _.clone(stats.sigma, true),
      media = _.clone(stats.media, true),
      N = _.clone(stats.N, true);
      for (var i = 0; i < l; i++) {
        if (!N[i]) {N[i] = 0;}

        if (!sigma[i]) {sigma[i] = 0;}

        if (!media[i]) {media[i] = 0;}

        media[i] = (media[i] * N[i] + doc.data[i]) / (N[i] + 1);
        sigma[i] = Math.sqrt((sigma[i] * sigma[i] * N[i] +
        (doc.data[i] - media[i]) * (doc.data[i] - media[i])) /
        (N[i] + 1));
        N[i] = N[i] + 1;
      }

      stats.sigma = sigma;
      stats.media = media;
      stats.N = N;
      stats.save(function() {
        doc.save(cb);
      });
    });
  };

  this.create = create.bind(this);
};

// Model of pca system
var schema = new Schema({
  V_T_matrix: Array,
  S_vector: Array,
});
schema.plugin(random);
var modelof_pca_system = function() {
  return mongoose.model('pca_system', schema);
};

Statsaving.modelof_pca_system = modelof_pca_system;
module.exports = Statsaving;
