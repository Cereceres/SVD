'use strict'
let random = require( '../Noether/noether' ).plugin;
let mongoose = require( '../mongoose' )( )
let Schema = mongoose.Schema;
// Model of pca system
let schema = new Schema( {
  V_T_matrix: Array,
  S_vector: Array,
  owner: String
}, {
  versionKey: false
} );
let schemadata = new Schema( {
  data: Array,
  owner: String
}, {
  versionKey: false
} );
let schemastats = new Schema( {
  sigma: Array,
  media: Array,
  N: Array,
  owner: String
}, {
  versionKey: false
} );

let ownersSchema = new Schema( {
  reference: String
}, {
  versionKey: false
} );
ownersSchema.plugin( random );
schemadata.plugin( random );
schemastats.plugin( random );
schema.plugin( random );
let data = mongoose.model( 'data', schemadata );
let stats = mongoose.model( 'stats', schemastats );
let model = mongoose.model( 'pca_system', schema );
let owners = mongoose.model( 'pca_system', ownersSchema );

module.exports = function ( ) {
  this.Modeldata = data
  this.Modelstats = stats
  this.Modelowners = owners
  this.modelof_pca_system = model

}