'use strict';

//Maxwell take a sample from a DB
var Riemann = require('../Riemann/riemann');
var riemann = new Riemann();
var data_model = riemann.Modeldata;
var A = [];
var options = { limit: 0 };
 var sample= function(Nsample, cb) {
   options.limit = Nsample;
  // console.log('the sample size is',Nsample);
  data_model.findRandom({}, {}, options,
    function(error, res) {
      if (error) {
        console.log('error = ', error);
        return;
      }
      res.forEach(function(item) {
        if (item.data.length>0) {
          A.push(item.data);
        }
      });
        cb(A);
        A = [];
    });
};
module.exports.sample = sample;
