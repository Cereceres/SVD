'use strict';

//testing the methos exported from Newton
var Newton = require('./newton');
var newton =new Newton.anormalDatum(0.07);
var fraud  = newton.isnormal,i=0;
var cb =  function(its) {
  console.log('fraude=', !its);
};
function f() {
  console.log('upgrading with newton');
  Newton.upgrade(11000,100,{limit : 0.7});
  console.log('the call number i='+i);
  setInterval(function () {
    fraud([10 * Math.random(), 10*Math.random(),
      10 * Math.random(),10*Math.random(),], cb);
  },550);
}

Newton.initall({sigma : [4,3,6,2],media:[7,1,5.7,14], N:[]},function () {
  console.log('Generaing the data with bayes');
  require('./Bayes/bayes')(1000, 4,2,function () {
    console.log('Bayes is done');
  });
  console.log('Doing calls of random data');
  f();
});
