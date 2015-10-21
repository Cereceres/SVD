'use strict';

//Bayes generate the aleatory data
var Riemann = new require('../Riemann/riemann');
var riemann = new Riemann();
var create = riemann.create;
var Noether = require('../Noether/noether');
var random = Noether.random;
var rand = Noether.r_uniform;
var A = [], sigma, media,  i = 0, j = 0,
 save, cb, end, time, start;

save = function(m, n) {
  i++;
  if (i < n) {
    A = [];
    for (j = 0; j < m; j++) {
      sigma = 10 * random();

      media = 10 * random();

      A[j] = rand(media, sigma);

    }

    create({data:A}, cb);
  }else {
    end = new Date().getTime();
    time = end - start;
    console.log('Done All with ' + n + ' data generated at Execution time: ' + time / 1000);
    return;
  }
};

cb = function(err) {
  if (err) {
    console.log('err=', err);
  }else {
    save();
  }
};

start = new Date().getTime();
module.exports = function(numDatos, numVariables) {
  var m = numVariables;
  var n = numDatos;
  save(m, n);
};
