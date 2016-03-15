'use strict'
let models = require( './models' )
let createData = require( './createData' )
let createDataGlobal = require( './createDataGlobal' )

// Riemann module make the stats into de data when the doc is saved
module.exports = function ( ) {
  models.call( this )
  let _this = this
  this.createData = function ( tosave, cb ) {
    createDataGlobal.apply( _this, [ tosave ] )
    createData.apply( _this, [ tosave, cb ] )

  };
};