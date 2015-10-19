'use strict';

//Maxwell make the analisys of data
var newton = require('bindings')('newton');
var f_newton = newton();
var Riemann = new require('../Riemann/riemann');
var riemann = new Riemann('data', 'stats');
var data_model = riemann.Modeldata;
var Noether = require('../Noether/noether');
var random = Noether.random;
var A = [], B = [];
var start = new Date().getTime();
data_model.findRandom({}, {data: 1, _id: 0}, { skip: 10, limit: 1000 }, function(error, res) {
    if (error) {
      console.log('error = ', error);
      return;
    }

    res.forEach(function(item) {
      A.push(item.data);
    });

    var l = A[0].length;
    for (var i = 0; i < l; i++) {
      B[i] = 20 * random();
    }

    var end = new Date().getTime();
    var time = end - start;
    console.log('p_x=', f_newton(A, 0.8, B).p_x);
    console.log('Execution time: ' + time / 1000);

  });
