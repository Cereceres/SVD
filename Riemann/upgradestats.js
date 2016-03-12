'use strict'
module.exports = function upgradestats( stats ) {
  if ( stats.count < stats.doc.data.length ) {
    let i = stats.count;
    if ( stats.N[ i ] === undefined || stats.N[ i ] === null || typeof stats.N[
        i ] ===
      'undefined' ) {
      stats.N[ i ] = 0;
    }
    if ( !stats.sigma[ i ] ) {
      stats.sigma[ i ] = 0;
    }
    if ( !stats.media[ i ] ) {
      stats.media[ i ] = 0;
    }
    stats.media[ i ] = ( stats.media[ i ] * stats.N[ i ] + stats.doc.data[ i ] ) /
      ( stats.N[ i ] + 1 );
    stats.sigma[ i ] = Math.sqrt( ( stats.sigma[ i ] * stats.sigma[ i ] *
        stats
        .N[ i ] +
        ( stats.doc.data[ i ] - stats.media[ i ] ) * ( stats.doc.data[ i ] -
          stats.media[ i ] ) ) /
      ( stats.N[ i ] + 1 ) );
    stats.N[ i ] = stats.N[ i ] + 1;
    stats.count = stats.count + 1;
    upgradestats( stats );
  }
}