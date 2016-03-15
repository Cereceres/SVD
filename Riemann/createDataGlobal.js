'use strict'
let _ = require( 'lodash' )
let debug = require( '../debug' ),
  l, doc;
let upgradestats = require( './upgradestats' )
module.exports = function ( tosave, cb ) {
  let _this = this
  return new Promise( function ( fulfill, reject ) {
    doc = new _this.Modeldata( {
      data: tosave
    } );
    l = doc.data.length;
    _this.Modelstats.findOne( {}, function ( error, stats ) {
      if ( !stats || error ) {
        reject( error );
      } else {
        fulfill( stats );
      }
    } );
  } ).then( function ( stats ) {
      debug.Riemann.info( 'the stats found:', stats )
      let sigma = _.clone( stats.sigma, true ),
        media = _.clone( stats.media, true ),
        N = _.clone( stats.N, true );
      let _stats = {
        sigma: sigma,
        media: media,
        N: N,
        doc: doc,
        count: 0
      };
      debug.Riemann.error( 'stats to upgrad', _stats );
      upgradestats( _stats );
      stats.sigma = _stats.sigma;
      stats.media = _stats.media;
      stats.N = _stats.N;
      stats.save( {
        validateBeforeSave: true
      }, function ( err, st ) {
        if ( err ) {
          debug.Riemann.error( 'error to save stats:', err );
        } else {
          debug.Riemann.info( 'stats saved:', st );
        }
        if ( typeof cb === 'function' ) {
          cb( err, st )
        }
      } )
    },
    function ( e ) {
      debug.Riemann.error( 'error to found stats or stats not found', e )
      _this.Modelstats.create( {
        sigma: [ ],
        media: [ ],
        N: [ ],
        owner: 0
      }, function ( _error, stats ) {
        if ( _error ) {
          debug.Riemann.error( 'error to create stats empty:',
            _error );
        } else {
          debug.Riemann.info( 'the empty stats are:', stats )
        }
        if ( typeof cb === 'function' ) {
          cb( _error, stats )
        }
      } )

    } );
};