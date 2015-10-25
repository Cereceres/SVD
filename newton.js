'use strict';

//Newton exports the save and p_x method
var Riemann = require('./Riemann/riemann');
module.exports.bayes = require('./Bayes/bayes');
var riemann = new Riemann();
var Curie = require('./Curie/curie'), P;
var curie = new Curie();
var AL = new require('nsolvejs').AL;
var _this = module.exports;

module.exports = function(Datum, cb, save) {
  if (save) {
    riemann(Datum);
  }

  curie.pca(function(p_x) {
    P = p_x(Datum);
    if (cb) {
      cb(P);
    }
  });
  return _this;

};

module.exports.upgrade = function(timeupgrade, sizesample, options) {
  curie.upgrade(timeupgrade, sizesample, options);
  return _this;
};

module.exports.stop = function() {
  curie.stop();
  return _this;
};

module.exports.save = function(Datum) {
  riemann.create(Datum);
  return _this;
};

module.exports.anormalDatum = function(dist, callback) {
  if (callback) {
    this.cb = callback;
  }

  this.dist = dist;
  var __this = this;
  this.isnormal = function(Datum, cb) {
    if (!cb) {cb = __this.cb;}

    module.exports(Datum, function(P) {
      if (__this.dist > P) {
        cb(false);
      }else {
        cb(true);
      }
    });

  };
	};


  module.exports.initall = function(stats,cb) {
      if (!stats) {
        stats = {sigma : [], media : [], N:[]};
      }
      var sigma = stats.sigma;
      var media = stats.media;
      var N = stats.N;
      var n = media.length ;
      var V_T = new AL.matrix.diagonal(n,n);
      var S  = new AL.matrix.create(n,1,function () {
        return 1;
      }).trans();
      riemann.Modelstats.find({},function (error,stats) {

        if(!stats.length){
        
          riemann.Modelstats.create({sigma : sigma, media:media , N:N},function (err) {
            if (err) {console.log('error on create stats:',err);}

            Riemann.modelof_pca_system().find({},function (arr,pca) {
              if (arr) {
                console.log('error on create stats:',arr);}
              if(!pca.length){
                Riemann.modelof_pca_system().create({V_T_matrix : V_T.array, S_vector : S.array[0]},cb);
              }
            });
          });
        }else {

          Riemann.modelof_pca_system().find({},function (arr,pca) {
            if (!pca.length) {

              Riemann.modelof_pca_system().create({V_T_matrix : V_T.array, S_vector : S.array[0]},cb);
            }
          });
        }
      });
      return _this;

  	};
