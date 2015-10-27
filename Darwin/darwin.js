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
  console.log('upgrading from darwin');
  // save the setIntervalID to stop it.
  var tostop = setInterval(function() {
    // the sample is taken
    samplig(sizesample, function(Sample) {
      // find the stats into de DB
      statsmodel.findOne({}, function function_name(err, stats) {
        if (err) {console.log('Error on findOne stats', err);}
        if (!Sample.length) { console.log('There is not Sample  enougth');return;}
        if (Sample.length) { if (Sample[0].length> Sample.length) { return;  }}
        // with the sample and stats make the pca analysis
        pca = gsl_pca(Sample, limit, [stats.media, stats.sigma]);
        if ( !pca.S_corr || !pca.V_trans ) {console.log('Pca is not made correctly');return ;}
        pcamodel.findOneAndUpdate({}, { V_T_matrix: pca.V_trans, S_vector: pca.S_corr },{new : true,upsert: true}, function(error,doc) {
          // if the pca doc does not exist, ti creates
          if(!doc){pcamodel.create({ V_T_matrix: pca.V_trans, S_vector: pca.S_corr },function (arr) {
            if (arr) {
              console.log('Error on create de PCA', arr);
            }
            console.log('PCA is created');
          });
          } else{
            if (error) {
              console.log('Error on update  PCA', error);
            }
            console.log('matrix is upgrade');
          }
        });
      });
    });
  }, timeupgrade);

  pca_sample.tostop = tostop;
};
// bind the stop method
pca_sample.stop = function() {
  clearInterval(pca_sample.tostop);
};

module.exports.pca_sample  = pca_sample;
