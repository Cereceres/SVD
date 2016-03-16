'use strict'
let models = require( './models' )
let createData = require( './createData' )
let createDataGlobal = require( './createDataGlobal' )

// Riemann module make the stats into de data when the doc is saved
module.exports.createData = function ( tosave, cb ) {
  createDataGlobal.apply( module.exports, [ tosave ] )
  createData.apply( module.exports, [ tosave, cb ] )

};

Object.assign( module.exports, models )