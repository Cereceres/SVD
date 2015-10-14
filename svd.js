'use strict';
var newton = require('bindings')('newton');
var f_newton = newton();
var  mongoose = require('./mongoose');
var data_model = require('./data_model');
var A=[];

  var start = new Date().getTime();
  data_model.find({}).select({ 'data': 1, '_id': 0}).exec(function (error,res) {
    if (error) {
      console.log('error = ',error);
      return;
    }
    res.forEach(function (item) {
      A.push(item.data);
    });
    var end = new Date().getTime();
    var time = end - start;
    console.log('p_x=',newton(A,0.8).p_x);
    console.log('Execution time: ' + time / 1000);

  });


  //mongoose.connection.close();
