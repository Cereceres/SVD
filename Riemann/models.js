'use strict'
let random = require( '../Noether/noether' ).plugin;
let mongoose = require( '../mongoose' )( )
let Schema = mongoose.Schema;
// Model of pca system
let schema = new Schema( {
  V_T_matrix: Array,
  S_vector: Array,
}, {
  versionKey: false
} );
let schemadata = new Schema( {
  data: Array,
}, {
  versionKey: false
} );
let schemastats = new Schema( {
  sigma: Array,
  media: Array,
  N: Array,
}, {
  versionKey: false
} );

schemadata.plugin( random );
schemastats.plugin( random );
schema.plugin( random );
let data = mongoose.model( 'data', schemadata );
let stats = mongoose.model( 'stats', schemastats );
let model = mongoose.model( 'pca_system', schema );

module.exports = function ( ) {
  this.Modeldata = data
  this.Modelstats = stats
  this.modelof_pca_system = function ( ) {
    return model
  };
}