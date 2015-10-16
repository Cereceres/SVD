'use strict';
var newton = require('bindings')('newton');
var f_newton = newton();
var data_model = require('./data_model');
var A=[],B=[];
  var start = new Date().getTime();
  data_model.findRandom({},{'data': 1, '_id': 0},{ skip: 10, limit: 1000000 },function (error,res) {
    if (error) {
      console.log('error = ',error);
      return;
    }
    console.log('numero de dato=',res);
    res.forEach(function (item) {
      A.push(item.data);
    });
    var l = A[0].length;
    for (var i = 0; i < l; i++) {
      B[i]=20 *Math.random();
    }
    var end = new Date().getTime();
    var time = end - start;
    console.log('p_x=',f_newton(A,0.8,B).p_x);
    console.log('Execution time: ' + time / 1000);

  });
