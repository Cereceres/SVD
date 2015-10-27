'use strict';

//Bayes generate the aleatory data
var Riemann = new require('../Riemann/riemann');
var AL = require('nsolvejs').AL;
var riemann = new Riemann();
var create = riemann.create;
var Noether = require('../Noether/noether');
var random = Noether.random;
var rand = Noether.normal;
var A = [], sigma, media,  i = 0, j = 0, _m, _n, Vx,Vy,_A,
 save, cb, end, time, start;

save = function(m, n,B) {
  _A = B;
  _m = m;
  _n = n;
  i++;
  A = [];
  A[0]=[];
  if (i < n) {
    for (j = 0; j < m; j++) {
      sigma = 100 * random();
      media = 20 * random();
      A[0][j] = rand(media, sigma);
    }
    Vy = new AL.matrix(A);
    Vx = _A.x(Vy.trans());
    create({data:Vx.trans().array[0]}, cb);
  }else {
    end = new Date().getTime();
    time = end - start;
    console.log('Done All with ' + _n + ' data generated at Execution time: ' + time / 1000);
    return;
  }
};

cb = function(err) {
  if (err) {
    console.log('err=', err);
  }else {
    save(_m, _n,_A);
  }
};


function asyncify(syncFn) {
  var   callback;
  return function() {
    var args = Array.prototype.slice.call(arguments);
      callback = args.pop();
    var result;
    setImmediate(function() {
      try {
        result = syncFn.apply(this, args);
      } catch (error) {
        return callback(error);
      }
      callback(null, result);
    });
  };
}

module.exports =asyncify(function(numDatos, numVariables,numVarCorr) {
  start = new Date().getTime();
  var m = numVariables;
  var n = numDatos;
  var k = numVarCorr;
  var B = new AL.matrix.create(m,k,function () {
    return -1+2*Math.random();
  });
  save(k, n,B);
});
