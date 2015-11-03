'use strict';

//Newton exports the save and p_x method
var Riemann = require('./Riemann/riemann');
module.exports.bayes = require('./Bayes/bayes');
var riemann = new Riemann();
var Curie = require('./Curie/curie'), P;
var curie = new Curie();
var AL = new require('nsolvejs').AL;
var _this = module.exports;
/* Here expors the method that calculate the probability of datum
*  the callback receive the probability as argument and sabe is a
*  boolean that say if datum is saved
*/



module.exports = function(Datum, cb, save) {
  if (save) {
    riemann.create(Datum);
  }

  curie.pca(function(p_x) {
    P = p_x(Datum);
    if (cb) {
      cb(P);
    }
  });
  return _this;

};

/* This function upgrade the pca analysis and save into de DB
*  The arguments are the time to upgrade, size of sample taken
*   and finally the options, only the limit to dimension reducing
*/
module.exports.upgrade = function(timeupgrade, sizesample, options) {
  curie.upgrade(timeupgrade, sizesample, options);
  return _this;
};
/* Stop the upgrade function
*/
module.exports.stop = function() {
  curie.stop();
  return _this;
};
/* Save the datum into de DB
*/
module.exports.save = function(Datum) {
  riemann.create(Datum);
  return _this;
};
/*@Constructor that build a anormal watcher datum.
* The arguments are the dist value to discard a datum,
* the callback receive true/false is the datum is anormal or not.
*/
module.exports.anormalDatum = function(dist, callback) {
  if (callback) {
    this.cb = callback;
  }

  this.dist = dist;
  var __this = this;
  /*the function anormal its available into the instance*/
  this.isnormal = function(Datum, cb,itsaved) {
    if(itsaved===undefined){itsaved = true;}
    if (!cb) {cb = __this.cb;}
    module.exports(Datum, function(P) {
      if (__this.dist > P) {
        cb(false);
      }else {
        cb(true);
      }
    },itsaved);

  };
};


  module.exports.initall =function(stats,cb) {
      if (!stats) {
        stats = {sigma : [], media : [], N:[]};
      }
      var sigma = stats.sigma;
      var media = stats.media;
      var N = stats.N;
      var n = media.length ;
      var V_T = new AL.matrix.diagonal(n,n);
      var S  = new AL.matrix.create(n,1,function (i) {
        return sigma[i];
      }).trans();
      var promise = new Promise(function (full,rej) {
        riemann.Modelstats.findOne({},function (error,stats) {
          if (error) {console.log('error on find stats:',error);}
          if(!stats){rej();
          }else { full();}
        });
      });
      promise.then(
        function _full() {
      },function _rej() {
        riemann.Modelstats.create({sigma : sigma, media:media , N:N},
          function (err,stats_created) {
          if (err) {console.log('error on create stats:',err);}else{
            console.log('stats created into initall:',stats_created);
          }
        });
      }).then(function () {
        Riemann.modelof_pca_system().findOne({},function (arr,pca) {
          if (arr) {console.log('error on find pca:',arr);}
          if (!pca) {
            Riemann.modelof_pca_system().create({V_T_matrix : V_T.array, S_vector : S.array[0]},cb);
          } else{
            if (typeof cb === 'function') {
                cb();
            }
          }
        });
      });

      return _this;

  	};
