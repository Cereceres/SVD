'use strict';
var addon = require('bindings')('addon');
var fn = addon();
var RNG = require('rng');
var rng = new RNG(Math.random);
var A = [], n = 1000, m = 10, sigma = 10 * Math.random(),
sqrt3 = Math.sqrt(3); var  _sqrt3 = 2 * sqrt3, media = 100 * Math.random(), i = 0, j = 0;

var rand = function(mu, sigma) {

  return mu - sqrt3 * sigma + _sqrt3 * rng.normal() * sigma + 50 * Math.random();
};

while (i < n) {
  A[i] = [];
  while (j < m) {
    sigma = 10 * Math.random();
    media = 100 * Math.random();
    A[i][j] = rand(media, sigma);
    j++;
  }

  i++;
}

var start = new Date().getTime();
console.log('A=', A.length);

//fn([[0.5, 0.5], [1, 0]], 1); // 'hello world'
fn(A, 0.8, [5, 2, 3, 5, 4, 3, 5, 6, 7, 2]);
console.log(fn(A, 0.8, [5, 2, 3, 5, 4, 3, 5, 6, 7, 2]));
var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time / 1000);
