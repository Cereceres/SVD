'use strict';

//testing the methos exported from Newton
var newton = require('./newton');
var fraud  = new newton.anormalDatum(0.03).isnormal;
var cb =  function(its) {
  console.log('fraude=', !its);
};

newton.initall({sigma : [1,1,1,1],media:[0,0,0,0], N:[]},function () {
  require('./Bayes/bayes')(10000, 4,2);
  for (var i = 0; i < 10; i++) {
    fraud([10 * Math.random(), 10*Math.random(),
  		10 * Math.random(),10*Math.random(),], cb);
  }
});
