'use strict';

//Maxwell make the analisys of data
var Riemann = new require('../Riemann/riemann');
var riemann = new Riemann('data', 'stats');
var data_model = riemann.Modeldata;
var A = [];
module.exports.sample = function(Nsample, cb) {
  data_model.findRandom({}, {data: 1, _id: 0}, { skip: 10, limit: Nsample },
    function(error, res) {
      if (error) {
        console.log('error = ', error);
        return;
      }

      res.forEach(function(item) {
        A.push(item.data);
      });

      cb(A);
    });
};
