'use strict'
let models = require( './models' )
let create = require( './createData' )
  // Riemann module make the stats into de data when the doc is saved
module.exports = function ( ) {
  models.call( this )
  this.create = create.bind( this );
};