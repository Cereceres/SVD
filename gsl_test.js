'use strict';
var addon = require('bindings')('addon');
var data_model = require('./data_model');
var fn = addon();
var RNG = require('rng');
var rng = new RNG(Math.random);
var A = [],sigma, media,sqrt3 = Math.sqrt(3);
var  _sqrt3 = 2 * sqrt3, i = 0, j = 0;

var rand = function(mu, sigma) {
  return mu - sqrt3 * sigma + _sqrt3 * rng.normal() * sigma + 50 * Math.random();
};
var cb =function(err) {
  if (err) {
    console.log('err=',err);
  }
};

var n = 10000, m=50;
  var measures = [];
  while (i < n) {
    A[i] = [];
    while (j < m) {
      measures[j]=10 * Math.random();
      sigma = 10 * Math.random();
      media = 100 * Math.random();
      A[i][j] = rand(media, sigma);
      j++;
    }
    //Meter objeto a bdd
    data_model.create({data:A[i]},cb);
    i++;
  }
  var start = new Date().getTime();

  //console.log(fn([[0.5, 0.5], [1, 0]], 0.8,[5, 2])); // 'hello world'
  //fn(A, 0.8, [5, 2, 3, 5, 4, 3, 5, 6, 7, 2]);
  console.log(fn(A, 0.8, measures).p_x);
  var end = new Date().getTime();
  var time = end - start;
  console.log('For',n,'data and ',m,'variables with Execution time: ' + time / 1000);
