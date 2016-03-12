'use strict';

//Bayes generate the aleatory data
let Riemann = require( '../Riemann/riemann' );
let riemann = new Riemann( )
let AL = require( 'nsolvejs' ).AL;
let debug = require( '../debug' )
let Noether = require( '../Noether/noether' );
let random = Noether.random;
let rand = Noether.normal;
let A = [ ],
  sigma, media, j = 0,
  i = 0,
  _m, _n, Vx, Vy, _A, _sigma = 20,
  _media = 100,
  datafake,
  save, cb

datafake = function ( m ) {
  if ( j < m ) {
    media = _media * random( );
    sigma = _sigma * random( );
    A.push( rand( media, sigma ) );
    j++;
    datafake( m );
  } else {
    Vy = new AL.matrix( A );
    Vx = _A.x( Vy );
    console.log( 'Vx.trans( ).array[ 0 ]', Vx.trans( ).array[ 0 ] );
    riemann.createData( Vx.trans( ).array[ 0 ], cb );
  }
};

save = function ( m, n, B ) {
  _A = B;
  _m = m; // Number of variables
  _n = n; // Number of datas
  A = [ ];
  _media = 800 * random( ) + 200;
  _sigma = _media / 20 * random( );
  if ( i <= _n ) {
    datafake( _m );
    i++;
  }
};

cb = function ( err, doc ) {
  if ( err ) {
    debug.Bayes.error( 'err on Bayes=', err );
  } else {
    debug.Bayes.info( 'data saved', doc )
    j = 0;
    A = [ ];
    save( _m, _n, _A );
  }

};

module.exports = function ( numdata, numletiables, numletCorr ) {
  let m = numletCorr;
  let n = numdata;
  let k = numletiables;
  console.log( 'k,m', k, m );
  let B = new AL.matrix.create( k, m, function ( ) {
    return -1 + 2 * Math.random( );
  } );
  try {
    save( m, n, B );
  } catch ( e ) {
    debug.Bayes.error( 'error on save', e );
  }

}