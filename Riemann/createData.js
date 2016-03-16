'use strict'
let _ = require( 'lodash' )
let debug = require( '../debug' ),
  l, doc;
let upgradestats = require( './upgradestats' )
module.exports = function ( tosave, cb ) {
  let _this = this
  return new Promise( function ( fulfill, reject ) {
    doc = new _this.Modeldata( {
      data: tosave.data,
      owner: tosave.owner
    } );
    l = doc.data.length;
    _this.Modelstats.findOne( {
      owner: tosave.owner
    }, function ( error, stats ) {
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
      } ).then( function ( ) {
        doc.save( function ( err, _doc ) {
          if ( err ) {
            debug.Riemann.error( 'error to save data:', err )
          } else {
            debug.Riemann.info( 'data saved is:', _doc )
          }
          if ( typeof cb === 'function' ) {
            cb( err, _doc )
          }

        } );
      } );
    },
    function ( e ) {
      debug.Riemann.error( 'error to found stats or stats not found', e )
      doc.save( ).then( function ( err ) {
        if ( err ) {
          debug.Riemann.error(
            'the error to save data with error in found stats:',
            err )
        }
        _this.Modelstats.create( {
          sigma: [ ],
          media: [ ],
          N: [ ],
          owner: tosave.owner
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
    } );
};