'use strict';
let config = require( './config' )
  //testing the methos exported from Newton
var Newton = require( './newton' )( config );

var newton = new Newton.anormalDatum( 0.20 );
var fraud = newton.isnormal,
  i = 0,
  j = 0,
  _sigma = 2,
  _media = 10;
var Noether = require( './Noether/noether' );
var rand = Noether.normal,
  datafake, cb, Datum;
var bayes = require( './Bayes/bayes' );



setInterval( function ( ) {
  _media = Math.pow( 10, 4 * Math.random( ) ) * Math.random( );
  _sigma = _media / Math.pow( 10, 2 * Math.random( ) ) * Math.random( );
}, 10000 );



function datafake( ) {

  Datum = [ rand( _media, _sigma ), Math.random( ) * rand( _media, _sigma ),
    Math.random( ) * rand( _media, _sigma ), Math.random( ) * rand( _media,
      _sigma )
  ];
  fraud( Datum, cb, true );
}

cb = function ( its ) {
  if ( !its ) {
    i++;
  } else {
    j++;
  }
  console.log( 'fraude=', !its, '% de fraudes =', 100 * i / ( i + j ) +
    '% with #=', i );
  datafake( );
};

function f( ) {
  console.log( 'upgrading with newton' );
  Newton.upgrade( 1000, 1000, {
    limit: 0.8
  } );
  console.log( 'haciendo llamdas fake' );
  datafake( );
}

function fakecalls( ndata, nvar, ncorr ) {
  bayes( ndata, nvar, ncorr, function ( ) {
    fakecalls( ndata, nvar, ncorr );
  } );

}
Newton.initAll( {
  sigma: [ 20, 38, 66, 122 ],
  media: [ 700, 156, 665.7, 1400 ],
  N: [ ]
}, function ( ) {
  console.log( 'Generaing the data with bayes' );
  fakecalls( 5000, 4, 2 );
  console.log( 'Doing calls of random data' );
  f( );
} );