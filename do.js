'use strict';
var arg={};
var exec = function (arg,cb) {
  if (arg.i <= arg.l) {
    cb(arg.i);
    arg.i=arg.i+1;
    exec(arg,cb);
  }
};

module.exports = function (n_0,n_k,cb) {
  arg.i = n_0;
  arg.l = n_k;
  exec(arg,cb);
};

var a=1;
var start = new Date();
  module.exports(0,10000,function (i) {
  Math.log(i);
  });
var time = new Date() - start;
console.log('the time for recursive =',time/1000);

a =1;
start = new Date();
  for (var i = 0; i < 10000; i++) {
Math.log(i);
  }
time = new Date() - start;
console.log('the time for loop =',time/1000);
