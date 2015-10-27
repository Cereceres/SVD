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

function asyncify(syncFn) {
  var   callback;
  return function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[args.length-1]==='function') {
      callback = args.pop();
    }else{callback = undefined;}
    var result;
    setImmediate(function() {
      try {
        result = syncFn.apply(this, args);
      } catch (error) {
        if (callback) {
          callback(error);
        }
      }
      if (callback) {
          callback(null, result);
      }
    });
  };
}

module.exports = asyncify(function(Datum, cb, save) {
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

});

/* This function upgrade the pca analysis and save into de DB
*  The arguments are the time to upgrade, size of sample taken
*   and finally the options, only the limit to dimension reducing
*/
module.exports.upgrade = asyncify(function(timeupgrade, sizesample, options) {
  curie.upgrade(timeupgrade, sizesample, options);
  return _this;
});
/* Stop the upgrade function
*/
module.exports.stop =asyncify( function() {
  curie.stop();
  return _this;
});
/* Save the datum into de DB
*/
module.exports.save = asyncify(function(Datum) {
  riemann.create(Datum);
  return _this;
});
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


  module.exports.initall =asyncify( function(stats,cb) {
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
            } else{
              cb();
            }
          });
        }
      });
      return _this;

  	});
