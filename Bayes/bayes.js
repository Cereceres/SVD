'use strict';

//Bayes generate the aleatory data
var Riemann = new require('../Riemann/riemann');
var AL = require('nsolvejs').AL;
var riemann = new Riemann();
var create = riemann.create;
var Noether = require('../Noether/noether');
var random = Noether.random;
var rand = Noether.normal;
var A = [], sigma, media, j = 0, _m, _n, Vx,Vy,_A,_sigma =20,_media=100,
 save, cb;

save = function(m, n,B) {
  _A = B;
  _m = m;
  _n = n;
  A = [];
  A[0]=[];
  setInterval(function () {
    _media = 800 * random()+200;
    _sigma = _media/20 *random();
  },8000);
setInterval(function () {
    for (j = 0; j < m; j++) {
      media = _media * random();
      sigma = _sigma* random();
      A[0][j] = rand(media, sigma);
    }
    Vy = new AL.matrix(A);
    Vx = _A.x(Vy.trans());
    create({data:Vx.trans().array[0]}, cb);
  },_n
);
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

module.exports =asyncify(function(timetogenerate, numVariables,numVarCorr) {

  var m = numVariables;
  var n = timetogenerate;
  var k = numVarCorr;
  var B = new AL.matrix.create(m,k,function () {
    return -1+2*Math.random();
  });
  save(k, n,B);
});
