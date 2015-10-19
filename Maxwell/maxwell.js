'use strict';

//Maxwell take a sample from a DB
var Riemann = require('../Riemann/riemann');
var riemann = new Riemann();
var data_model = riemann.Modeldata;
var _ = require('lodash');
var A = [];
module.exports.sample = function(Nsample, cb) {
  data_model.findRandom({}, {data: 1, _id: 0}, { limit: Nsample },
    function(error, res) {
      if (error) {
        console.log('error = ', error);
        return;
      }
      res.forEach(function(item) {
        A.push(item.data);
      });
      var _A = _.clone(A,true);
      A=[];
      cb(_A);
    });
};
