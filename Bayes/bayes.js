'use strict';

//Bayes generate the aleatory data
let Riemann = new require( '../Riemann/riemann' );
let AL = require( 'nsolvejs' ).AL;
let debug = require( '../debug' )
let riemann
let create
let Noether = require( '../Noether/noether' );
let random = Noether.random;
let rand = Noether.normal;
let A = [ ],
  sigma, media, j = 0,
  _m, _n, Vx, Vy, _A, _sigma = 20,
  _media = 100,
  i, datafake,
  save, cb;

datafake = function ( m ) {
  if ( j < m ) {
    media = _media * random( );
    sigma = _sigma * random( );
    A[ j ] = rand( media, sigma );
    j++;
    datafake( m );
  } else {
    Vy = new AL.matrix( A );
    Vx = _A.x( Vy.trans( ) );
    create( {
      data: Vx.trans( ).array[ 0 ]
    }, cb );
    j = 0;
    A = [ ];
  }
};

save = function ( m, n, B ) {
  _A = B;
  _m = m;
  _n = n;
  A = [ ];
  _media = 800 * random( ) + 200;
  _sigma = _media / 20 * random( );
  if ( i <= _n ) {
    datafake( _m );
    i++;
  }
};

cb = function ( err ) {
  if ( err ) {
    debug.Bayes.error( 'err on Bayes=', err );
  } else {
    save( _m, _n, _A );
  }
};

function asyncify( syncFn ) {
  let callback;
  return function ( ) {
    let args = Array.prototype.slice.call( arguments );
    callback = args.pop( );
    let result;
    setImmediate( function ( ) {
      try {
        result = syncFn.apply( this, args );
      } catch ( error ) {
        return callback( error );
      }
      callback( null, result );
    } );
  };
}

module.exports = asyncify( function ( timetogenerate, numletiables, numletCorr,
  config ) {
  riemann = new Riemann( config );
  create = riemann.create;
  let m = numletiables;
  let n = timetogenerate;
  let k = numletCorr;
  let B = new AL.matrix.create( m, k, function ( ) {
    return -1 + 2 * Math.random( );
  } );
  save( k, n, B );
} );