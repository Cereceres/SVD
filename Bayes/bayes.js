'use strict';

//Bayes generate the aleatory data
var Riemann = new require('../Riemann/riemann');
var riemann = new Riemann('data', 'stats');
var create = riemann.create;
var Noether = require('../Noether/noether');
var random = Noether.random;
var rand = Noether.r_uniform;
var A = [], sigma, media,  i = 0, j = 0, m = 10, n = 1000,
 save, cb, end, time, start;

save = function() {
  i++;
  if (i < n) {
    A = [];
    for (j = 0; j < m; j++) {
      sigma = 10 * random();
      media = 10 * random();
      A[j] = rand(media, sigma);
    }

    console.log('i=', i);
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
save();
