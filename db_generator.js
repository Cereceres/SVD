'use strict';
var data_model = require('./data_model');
var statsaving = new requiere('./Riemann/riemann').Statsaving(data_model);
var A = [],sigma, media,sqrt3 = Math.sqrt(3);
var  _sqrt3 = 2 * sqrt3, i = 0, j = 0, m=10, n=1000000000,save,cb,end,time,start;

var rand = function(mu, sigma) {
  return mu - sqrt3 * sigma + _sqrt3 * Math.random() * sigma ;
};

save = function( ) {
  i++;
  if (i<n) {
    A= [];
    for (j = 0;j < m;j++) {
      sigma = 10 * Math.random();
      media = 10 * Math.random();
      A[j] = rand(media, sigma);
    }
    statsaving({data:A},cb);
  }else{
    end = new Date().getTime();
    time = end - start;
    console.log('Done All with '+n+' data generated at Execution time: ' + time / 1000);
    return;
  }
} ;
cb = function(err) {
  if (err) {
    console.log('err=',err);
  }else{
    save();
  }
};

start = new Date().getTime();
save();
