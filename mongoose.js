'use strict';

var _config = require( './config' ),
  mongoose = require( 'mongoose' )
module.exports = function ( config ) {
  // Connect to mongo by url

  config = config || _config
  mongoose.connect( config.mongo.url );
  return mongoose
}