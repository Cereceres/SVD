'use strict';
let random = require( '../Noether/noether' ).plugin;
let _ = require( 'lodash' ),
  _this, l, doc;



function upgradestats( stats ) {
  if ( stats.count < stats.doc.data.length ) {
    let i = stats.count;
    if ( !stats.N[ i ] ) {
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
    stats.sigma[ i ] = Math.sqrt( ( stats.sigma[ i ] * stats.sigma[ i ] * stats
        .N[ i ] +
        ( stats.doc.data[ i ] - stats.media[ i ] ) * ( stats.doc.data[ i ] -
          stats.media[ i ] ) ) /
      ( stats.N[ i ] + 1 ) );
    stats.N[ i ] = stats.N[ i ] + 1;
    stats.count = stats.count + 1;
    upgradestats( stats );
  }
}
// Riemann module make the stats into de data when the doc is saved
let Statsaving = function ( mongoose ) {
  mongoose = mongoose || require( '../mongoose' );
  let Schema = mongoose.Schema;
  // Model of pca system
  let schema = new Schema( {
    V_T_matrix: Array,
    S_vector: Array,
  } );
  schema.plugin( random );
  let modelof_pca_system = function ( ) {
    return mongoose.model( 'pca_system', schema );
  };
  this.modelof_pca_system = modelof_pca_system;
  let debug = require( '../debug' )

  let schemadata = new Schema( {
    data: Array,
  } );
  let schemastats = new Schema( {
    sigma: Array,
    media: Array,
    N: Array,
  } );
  schemadata.plugin( random );
  schemastats.plugin( random );
  let Modeldata = mongoose.model( 'data', schemadata );
  let Modelstats = mongoose.model( 'stats', schemastats );

  this.Modeldata = Modeldata;
  this.Modelstats = Modelstats;
  _this = this;
  let create = function ( tosave, cb ) {
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
              cb( _doc )
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
            N: [ ]
          }, function ( _error, stats ) {
            if ( _error ) {
              debug.Riemann.error( 'error to create stats empty:',
                _error );
            } else {
              debug.Riemann.info( 'the empty stats are:', stats )
            }
          } ).then( function ( ) {
            if ( typeof cb === 'function' ) {
              cb( )
            }
          } );
        } );
      } );
  };
  this.create = create.bind( this );
};
module.exports = Statsaving;