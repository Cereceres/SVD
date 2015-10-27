'use strict';

//testing the methos exported from Newton
var Newton = require('./newton');
var newton =new Newton.anormalDatum(0.20);
var fraud  = newton.isnormal,i=0,j=0,_sigma,_media;
var Noether = require('./Noether/noether');
var random = Noether.random;
var rand = Noether.normal;
var cb =  function(its) {
  if (!its) {
    i++ ;
  }else {
    j++;
  }
  console.log('fraude=', !its, '% de fraudes =',i/(i+j)+'%');
};

setInterval(function () {
  _media = random(200,800);
  _sigma = _media/8 *Math.random();
},8000);

function f() {
  console.log('upgrading with newton');
  Newton.upgrade(10000,100000,{limit : 0.8});
  setInterval(function () {
    fraud([rand(_media,_sigma), Math.random()*rand(_media,_sigma),
      Math.random()*rand(_media,_sigma),Math.random()*rand(_media,_sigma)], cb);
  },100);
}

Newton.initall({sigma : [20,38,66,122],media:[700,156,665.7,1400], N:[]},function () {
  console.log('Generaing the data with bayes');
  require('./Bayes/bayes')(10000000, 4,2,function () {
    console.log('Bayes is done');
  });
  console.log('Doing calls of random data');
  f();
});
