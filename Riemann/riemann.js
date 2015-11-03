'use strict';
var   mongoose = require('../mongoose');
var Schema = mongoose.Schema;
var random = require('../Noether/noether').plugin;
var _ = require('lodash'),_this,l,doc;
var schemadata = new Schema({
  data: Array,
});
var schemastats = new Schema({
  sigma: Array,
  media: Array,
  N: Array,
});
schemadata.plugin(random);
schemastats.plugin(random);
var Modeldata  = mongoose.model('data', schemadata);
var Modelstats  = mongoose.model('stats', schemastats);


function upgradestats(stats){
    if(stats.count<doc.data.length) {
      var i=stats.count;
    if (!stats.N[i]) {stats.N[i] = 0;}
    if (!stats.sigma[i]) {stats.sigma[i] = 0;}
    if (!stats.media[i]) {stats.media[i] = 0;}
    stats.media[i] = (stats.media[i] * stats.N[i] + stats.doc.data[i]) / (stats.N[i] + 1);
    stats.sigma[i] = Math.sqrt((stats.sigma[i] * stats.sigma[i] * stats.N[i] +
    (stats.doc.data[i] - stats.media[i]) * (stats.doc.data[i] - stats.media[i])) /
    (stats.N[i] + 1));
    stats.N[i] = stats.N[i]+1;
    stats.count= stats.count+1;
    upgradestats(stats);
  }

}
// Riemann module make the stats into de data when the doc is saved
var Statsaving = function() {
  this.Modeldata  = Modeldata;
  this.Modelstats  = Modelstats;
   _this = this;
  var create = function(tosave, cb) {
    var promise = new Promise(function (fulfill, reject) {

        doc = new _this.Modeldata({data : tosave});
        l = doc.data.length;

        _this.Modelstats.findOne({}, function(error, stats) {
        if (error) {
        console.log('error on find stats into Reamann',error);
        }

        if(!stats){reject();}else{fulfill(stats);}
      });
    }
    );
    promise.then(function (stats) {
      var sigma = _.clone(stats.sigma,true),
      media = _.clone(stats.media,true),
      N = _.clone(stats.N,true);
      var _stats ={sigma:sigma,media:media,N:N,doc:doc,count:0};
      upgradestats(_stats);
      stats.sigma = _stats.sigma;
      stats.media = _stats.media;
      stats.N = _stats.N;
      stats.save({validateBeforeSave:true},function(err,st) {
        if (err) {  console.log('error to save stats=',err);}else{
          console.log('stats saved=',st);
        }
      }).then(function () {doc.save(cb);});
    },
    function () {
      doc.save().then(function () {
      _this.Modelstats.create({sigma:[],media:[],N:[]},function (_error) {
        if (_error) {  console.log('error to create stats=',_error);}
      }).then(cb);
      });
    });
  };
  this.create = create.bind(this);
};

// Model of pca system
var schema = new Schema({
  V_T_matrix: Array,
  S_vector: Array,
});
schema.plugin(random);
var modelof_pca_system = function() {
  return mongoose.model('pca_system', schema);
};

Statsaving.modelof_pca_system = modelof_pca_system;
module.exports = Statsaving;
// new Statsaving().create([3,7,6,4],function () {
//   console.log('guardado');
// });
