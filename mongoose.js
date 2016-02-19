'use strict';

var config = require( './config' ),
  mongoose = require( 'mongoose' ),
  P = require( 'bluebird' );

// Promisify mongoose with Bluebird
P.promisifyAll( mongoose );
// Connect to mongo by url
mongoose.connect( config.mongo.url );

module.exports = mongoose;