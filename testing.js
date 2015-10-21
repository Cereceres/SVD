'use strict';

//testing the methos exported from Newton
var newton = require('./newton');
var fraud  = new newton.anormalDatum(0.03).isnormal;
require('./Bayes/bayes')(10000, 4,2);
var cb =  function(its) {
  console.log('fraude=', !its);
};

for (var i = 0; i < 10; i++) {
  fraud([10 * Math.random(), 10 * Math.random(),
		10 * Math.random(), 10 * Math.random(),], cb);
}
