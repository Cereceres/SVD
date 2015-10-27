'use strict';
var newton = require('bindings')('newton');
var gsl_pca = newton.pca;
var Riemann = require('../Riemann/riemann');
var pcamodel = Riemann.modelof_pca_system();
var riemann = new Riemann();
var statsmodel = riemann.Modelstats;
var samplig = require('../Maxwell/maxwell').sample;
var pca;

// make the stats into de data to generate
// the pca_system into the DB
var pca_sample = function(timeupgrade, sizesample, options) {
  options = options || {limit: 0.75};
  var limit = options.limit;
  var tostop = setInterval(function() {
    samplig(sizesample, function(Sample) {
      statsmodel.findOne({}, function function_name(err, stats) {
        pca = gsl_pca(Sample, limit, [stats.media, stats.sigma]);
        pcamodel.findOneAndUpdate({}, { V_T_matrix: pca.V_trans, S_vector: pca.S_corr },{new : true,upsert: true}, function(error,doc) {
          if(!doc){pcamodel.create({ V_T_matrix: pca.V_trans, S_vector: pca.S_corr },function (arr) {
            if (arr) {
              console.log('Error on create de PCA', arr);
            }
            console.log('matrix is updated');
          });}
          if (error) {
            console.log('Error on save de PCA', error);
          }
          console.log('matrix is upgrade');
        });
      });
    });
  }, timeupgrade);

  pca_sample.tostop = tostop;
};

pca_sample.stop = function() {
  clearInterval(pca_sample.tostop);
};

module.exports.pca_sample  = pca_sample;
