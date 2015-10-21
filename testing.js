'use strict';

//testing the methos exported from Newton
var newton = require('./newton');
var fraud  = new newton.anormalDatum(0.03).isnormal;
var cb =  function(its) {
  console.log('fraude=', !its);
};

for (var i = 0; i < 1000; i++) {
  fraud([10 * Math.random(), 10 * Math.random(),
		10 * Math.random(), 10 * Math.random(),], cb);
}
