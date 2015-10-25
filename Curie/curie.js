'use strict';

//Curie calculate the probability of data given
var newton = require('bindings')('newton');
var Riemann = require('../Riemann/riemann');
var pcamodel = Riemann.modelof_pca_system();
var riemann = new Riemann();
var statsmodel = riemann.Modelstats;
var p_x = newton.p_x;
var uprade_pca = require('../Darwin/darwin').pca_sample;


var Pca_analysis = function(V_matrix, S_vector, _stats) {
  this.V      = V_matrix;
  this.S      = S_vector;
  this.stats  = _stats;
  this.p_x    = (function(analytic) {
    return p_x(this.V, analytic, this.S, this.stats);
  }).bind(this);

};

var Pca_analytic = function(timeupgrade, sizesample, options) {
    this.pca_vars = {V_T:[], S:[], stats:[]};
  //if the time arguments is passed the upgrade methos is exec
    if (timeupgrade)    {this.timeupgrade = timeupgrade;}
    if (sizesample)     {this.sizesample = sizesample ;}
    if (options)  {this.options = options;}
    var _this = this;
  // the upgrade method
    this.upgrade = function(timeupgrade, sizesample, options) {
        if (timeupgrade)    {_this.timeupgrade = timeupgrade;}
        if (sizesample)     {_this.sizesample = sizesample ;}
        if (options)  {_this.options = options;}
        uprade_pca(_this.timeupgrade, _this.sizesample, _this.options);
    };

    this.stop = function() {
      uprade_pca.stop();
    };
    // the callback receive the p_x function as argument.
    this.pca = function(cb) {
      statsmodel.findOne({}, function function_name(err, stats) {
        _this.pca_vars.stats =
        [stats.media, stats.sigma];
        pcamodel.findOne({}, function(error, pca) {
          _this.pca_vars.V_T  = pca.V_T_matrix;
          _this.pca_vars.S    = pca.S_vector;
          pca = new Pca_analysis(_this.pca_vars.V_T, _this.pca_vars.S, _this.pca_vars.stats);
          cb(pca.p_x);
        });
      });
    };
  };




module.exports = Pca_analytic;
