'use strict';

//Newton exports the save and p_x method
var Riemann = require('./Riemann/riemann');
var riemann = new Riemann();
var Curie = require('./Curie/curie'), P;
var curie = new Curie();

module.exports = function(Datum, cb, upgrade) {
  if (upgrade) {
    riemann(Datum);
  }

  curie.pca(function(p_x) {
    P = p_x(Datum);
    if (cb) {
      cb(P);
    }
  });
};

module.exports.upgrade = function(timeupgrade, sizesample, options) {
  curie.upgrade(timeupgrade, sizesample, options);
};

module.exports.stop = function() {
  Curie.stop();
};

module.exports.save = function(Datum) {
  riemann.create(Datum);
};

module.exports.anormalDatum = function(dist, callback) {
  if (callback) {
    this.cb = callback;
  }

  this.dist = dist;
  var _this = this;
  this.isnormal = function(Datum, cb) {
    if (!cb) {cb = _this.cb;}

    module.exports(Datum, function(P) {
      if (_this.dist > P) {
        cb(false);
      }else {
        cb(true);
      }
    });

  };
	};
