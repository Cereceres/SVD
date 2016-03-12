'use strict'
let models = require( './models' )
let createData = require( './createData' )
  // Riemann module make the stats into de data when the doc is saved
module.exports = function ( ) {
  models.call( this )
  let _this = this
  this.createData = function ( tosave, cb ) {
    console.log( 'data to save  : ', tosave );
    createData.apply( _this, [ tosave, cb ] )
  };
};