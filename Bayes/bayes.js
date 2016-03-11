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
  console.log( 'datafacke =', j < m );
  if ( j < m ) {
    media = _media * random( );
    sigma = _sigma * random( );
    console.log( 'media, sigma', media, sigma );
    A[ j ] = rand( media, sigma );
    j++;
    datafake( m );
  } else {
    console.log( 'A__=', A );
    console.log( 'AL.matrix', AL.matrix );
    Vy = new AL.matrix( A );
    console.log( 'Vy', Vy );
    Vx = _A.x( Vy.trans( ) );
    console.log( 'Vx', Vx.array );
    create( {
      data: Vx.trans( ).array[ 0 ]
    }, cb );
    j = 0;
    A = [ ];
  }
};

save = function ( m, n, B ) {
  console.log( 'm, n', m, n );
  _A = B;
  _m = m;
  _n = n;
  A = [ ];
  _media = 800 * random( ) + 200;
  _sigma = _media / 20 * random( );
  console.log( '_media', _media );
  if ( j <= _n ) {
    datafake( _m );
    j++;
  }
};

cb = function ( err ) {
  if ( err ) {
    debug.Bayes.error( 'err on Bayes=', err );
  } else {
    save( _m, _n, _A );
  }
};

module.exports = function ( numdata, numletiables, numletCorr ) {
  riemann = new Riemann( );
  create = riemann.create;
  let m = numletiables;
  let n = numdata;
  let k = numletCorr;
  let B = new AL.matrix.create( m, k, function ( ) {
    return -1 + 2 * Math.random( );
  } );
  console.log( 'B.array', B.array );
  try {
    save( k, n, B );
  } catch ( e ) {
    console.log( 'error on save', e );
  }

}