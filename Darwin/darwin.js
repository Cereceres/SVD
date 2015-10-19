'use strict';
var newton = require('bindings')('newton');
var gsl_pca = newton.pca;
var Riemann = require('../Riemann/riemann');
var pcamodel = Riemann.modelof_pca_system();
var riemann = new Riemann();
var statsmodel =riemann.Modelstats;
var samplig = require('../Maxwell/maxwell').sample;
var pca ;

// Riemann module make the stats into de data to generate
// the pca_system into the DB
var pca_sample = function(timeupgrade, sizesample,options) {
  options = options || {limit : 0.9};
  var limit = options.limit;
  var tostop= setInterval(function () {
    samplig(sizesample,function (Sample) {
      statsmodel.findOne({},function function_name(err,stats) {
        pca = gsl_pca(Sample,limit,[stats.media,stats.sigma]);
        pcamodel.update({}, { $set: { V_T_matrix: pca.V_trans,S_vector : pca.S_corr }},function (error) {
          if (error) {
            console.log('Error on save de PCA',error);
          }
          console.log('matrix is upgrade');
        });
      });
    });
  }, timeupgrade);
  pca_sample.tostop = tostop;
  return tostop;
};
pca_sample.stop = function () {
  clearInterval(pca_sample.tostop);
};

module.exports.pca_sample  = pca_sample ;
