'use strict';

//Curie calculate the probability of data given
var newton = require('bindings')('newton');
var Riemann = require('../Riemann/riemann');
var pcamodel = Riemann.modelof_pca_system;
var riemann = new Riemann();
var statsmodel =riemann.Modelstats;
var p_x = newton.p_x;
var uprade_pca = require('../Darwin/darwin').pca_sample;
var Pca_analysis= function (V_matrix,S_vector,_stats) {
  this.V=V_matrix;
  this.S = S_vector;
  this.stats = _stats;
  this.p_x= (function (analytic) {
    return p_x(this.V,analytic,this.S,this.stats);
  }).bind(this);

};


var Pca_analytic= function (timeupgrade, sizesample,options) {
  uprade_pca(timeupgrade, sizesample,options);
  this.pca_vars = {V_T:[],S:[],stats :[]};
  var pca_vars=this.pca_vars ;
  this.tostop = setInterval(function () {
        statsmodel.findOne({},function function_name(err,stats) {
          pca_vars.stats = [stats.media, stats.sigma];
          pcamodel.findOne({},function (error,pca) {
            pca_vars.V_T = pca.V_T_matrix;
            pca_vars.S = pca.S_vector;
          });
        });
  }, 3*timeupgrade);
  this.pca = function () {
    var pca = new Pca_analysis(this.pca_vars.V_T,this.pca_vars.S,this.pca_vars.stats);
    return pca;
  };
  this.stop = function () {
      clearInterval(this.tostop);
      uprade_pca.stop();
  };
};
//console.log('pca=',new Pca_analytic(1000,1000).pca() );
module.exports.Pca_analytic = Pca_analytic;
