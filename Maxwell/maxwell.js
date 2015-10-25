'use strict';

//Maxwell take a sample from a DB
var Riemann = require('../Riemann/riemann');
var riemann = new Riemann();
var data_model = riemann.Modeldata;
var A = [];
module.exports.sample = function(Nsample, cb) {
  data_model.findRandom({}, {}, { limit: Nsample },
    function(error, res) {
      if (error) {
        console.log('error = ', error);
        return;
      }

      res.forEach(function(item) {
        A.push(item.data);
      });

      cb(A);
      A = [];
    });
};
