'use strict';
var data_model = require('./data_model');
var RNG = require('rng');
var rng = new RNG(Math.random);
var A = [],sigma, media,sqrt3 = Math.sqrt(3);
var  _sqrt3 = 2 * sqrt3, i = 0, j = 0;

var rand = function(mu, sigma) {
  return mu - sqrt3 * sigma + _sqrt3 * Math.random() * sigma ;
};
var cb =function(err) {
  if (err) {
    console.log('err=',err);
  }
};
var n = 100, m=50;
  while (i < n) {

    while (j < m) {

      sigma = 10 * Math.random();
      media = 10 * Math.random();
      A[j] = rand(media, sigma);
      j++;
    }
    //Meter objeto a bdd
    data_model.create({data:A},cb);
    i++;
  }
  console.log('termino');
//mongoose.connection.close();
