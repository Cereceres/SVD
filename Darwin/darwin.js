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

      if (!Sample.length) {return ;}
      if (Sample.length) {if (Sample.length <= Sample[0].length) {
        return ;
      }}

      // find the stats into de DB
      statsmodel.findOne({}, function function_name(err, stats) {
        if (err) {console.log('Error on findOne stats', err);}
        // with the sample and stats make the pca analysis
        if (stats){
          pca = gsl_pca(Sample, limit, [stats.media, stats.sigma]);
          pcamodel.findOneAndUpdate({}, { V_T_matrix: pca.V_trans, S_vector: pca.S_corr },{new : true,upsert: true}, function(error) {
            // if the pca doc does not exist, is created
          if (error) {
            console.log('error on update pca :',error);}


          });
        }
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
