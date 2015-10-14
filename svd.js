'use strict';
var newton = require('bindings')('newton');
var f_newton = newton();
var data_model = require('./data_model');
var A=[];

  var start = new Date().getTime();
  data_model.find({},{'data': 1, '_id': 0},function (error,res) {
    if (error) {
      console.log('error = ',error);
      return;
    }

    res.forEach(function (item) {
      A.push(item.data);
      //console.log('A=',item.data);
    });
    //console.log('A=',A[0]['0']);
    var end = new Date().getTime();
    var time = end - start;
    console.log('p_x=',f_newton( [[4,31,2],[41,3,2],[41,3,2],[4,13,2],[4,3,22],[4,3,22],[24,3,2],[45,3,2],[34,3,2],[34,3,32],[40,13,2]],0.8,[0,0,2]).sqrt(4) );
  //  console.log('p_x=',f_newton( A,0.8).sqrt(4) );
    console.log('Execution time: ' + time / 1000);

  });


  //mongoose.connection.close();
