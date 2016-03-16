'use strict';
//testing the methos exported from Newton
let Newton = require( './newton' )( );
let newton = new Newton.anormalDatum( 0.20 );
let fraud = newton.isnormal,
  i = 0,
  j = 0,
  _sigma = 2,
  _media = 10;
let Noether = require( './Noether/noether' );
let rand = Noether.normal,
  datafake, cb, Datum;
let bayes = require( './Bayes/bayes' );
let owner = [ ]
for ( let i = 0; i < 1000; i++ ) {
  owner.push( i + 1 )
}

setInterval( function ( ) {
  _media = Math.pow( 10, 4 * Math.random( ) ) * Math.random( );
  _sigma = _media / Math.pow( 10, 2 * Math.random( ) ) * Math.random( );
}, 10000 );



datafake = function ( ) {
  Datum = [ ]
  for ( let i = 0; i < 10; i++ ) {
    Datum.push( Math.random( ) * rand( _media, _sigma ) )
  }
  console.log( 'Datum=', Datum );
  try {
    fraud( {
      data: Datum,
      owner: Math.floor( owner.length * Math.random( ) )
    }, cb, true );
  } catch ( e ) {
    console.log( 'error en fraud=', e.stack );
  }

}

cb = function ( its ) {
  console.log( 'its=', its );
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

Newton.initAll( {
  sigma: [ 20, 38, 66, 122, 34, 456, 345, 32, 32, 4 ],
  media: [ 700, 156, 665.7, 1400, 21, 3, 4, 5, 677, 12 ],
  N: [ ]
}, function ( ) {
  console.log( 'Generaing the data with bayes' );
  bayes( 200, 10, 2 );
  console.log( 'Doing calls of random data' );
  f( );
} );