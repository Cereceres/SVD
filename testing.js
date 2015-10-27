'use strict';

//testing the methos exported from Newton
var Newton = require('./newton');
var newton =new Newton.anormalDatum(0.10);
var fraud  = newton.isnormal,i=0,j=0;
var cb =  function(its) {
  if (!its) {
    i++ ;
  }else {
    j++;
  }
  console.log('fraude=', !its, '% de fraudes =',i/(i+j)+'%');
};
function f() {
  console.log('upgrading with newton');
  Newton.upgrade(1000,100000,{limit : 0.8});
  console.log('the call number i='+i);
  setInterval(function () {
    fraud([10 * Math.random(), 10*Math.random(),
      10 * Math.random(),10*Math.random(),], cb);
  },50);
}

Newton.initall({sigma : [4,3,6,2],media:[7,1,5.7,14], N:[]},function () {
  console.log('Generaing the data with bayes');
  require('./Bayes/bayes')(10000000, 4,2,function () {
    console.log('Bayes is done');
  });
  console.log('Doing calls of random data');
  f();
});
