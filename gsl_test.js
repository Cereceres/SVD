'use strict';
var addon = require('bindings')('addon');
var fn = addon();
var RNG = require('rng');
var rng = new RNG(Math.random);
var A = [], n=1000000, m=3, sigma = 10*Math.random(),
sqrt3 = Math.sqrt(3); var  _sqrt3=2*sqrt3, media=100*Math.random(),i=0,j=0;

var rand = function(mu,sigma) {

  return mu-sqrt3*sigma+_sqrt3*rng.normal()*sigma + 50*Math.random();
};

while (i<n) {
  A[i]=[];
  while (j<m) {
    sigma = 10*Math.random();
    media=100*Math.random();
    A[i][j]= rand(media,sigma);
    j++;
  }
  i++;
}
console.log('A=',A.length);
fn([[1,2,3,4],[3,4,6,3],[2,3,4,3],[5,3,4,2],[1,2,3,1],[0,0,0,1]],0.8); // 'hello world'
