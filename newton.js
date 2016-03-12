'use strict';
let Riemann = require( './Riemann/riemann' )
let Curie = require( './Curie/curie' ),
  P;
let curie = new Curie( );
let debug = require( './debug' )
let AL = new require( 'nsolvejs' ).AL;
/**Here the newton methods are exposed*/
module.exports = function ( config ) {
  let riemann = new Riemann( config ),
    modelof_pca_system = riemann.modelof_pca_system( )
    //Newton exports the save and p_x method
  let _this = {}
  _this.bayes = require( './Bayes/bayes' );

  /* Here exponds the method that calculate the probability of datum
   *  the callback receive the probability as argument and sabe is a
   *  boolean that say if datum is saved
   */

  _this = function ( Datum, cb, save ) {
    if ( save ) {
      riemann.createData( Datum, function ( ) {
        curie.pca( function ( p_x ) {
          P = p_x( Datum );
          if ( cb ) {
            cb( P );
          }
        } );
      } );
    } else {
      curie.pca( function ( p_x ) {
        P = p_x( Datum );
        if ( cb ) {
          cb( P );
        }
      } );
    }
    return _this;
  };

  /* This function upgrade the pca analysis and save into de DB
   *  The arguments are the time to upgrade, size of sample taken
   *  and finally the options, only the limit to dimension reducing
   */
  _this.upgrade = function ( timeupgrade, sizesample, options ) {
    curie.upgrade( timeupgrade, sizesample, options );
    return _this;
  };
  /* Stop the upgrade function
   */
  _this.stop = function ( ) {
    curie.stop( );
    return _this;
  };
  /* Save the datum into de DB
   */
  _this.save = function ( Datum ) {
    riemann.createData( Datum );
    return _this;
  };
  /*@Constructor that build a anormal watcher datum.
   * The arguments are the dist value to discard a datum,
   * the callback receive true/false is the datum is anormal or not.
   */
  _this.anormalDatum = function ( dist, callback ) {
    if ( typeof callback === 'function' ) {
      this.cb = callback;
    } else {
      this.cb = function ( its ) {
        debug.info( 'anormalDatum:', its )
        return this
      }
    }

    this.dist = dist;
    let __this = this;
    /*the function anormal its available into the instance*/
    this.isnormal = function ( Datum, cb, itsaved ) {
      if ( typeof cb === 'boolean' ) {
        itsaved = cb
        cb = undefined
      }
      if ( itsaved === undefined ) {
        itsaved = true;
      }
      if ( typeof cb === 'function' ) {
        __this.cb = cb
      }
      _this( Datum, function ( P ) {
        if ( __this.dist > P ) {
          __this.cb( false );
        } else {
          __this.cb( true );
        }
      }, itsaved );

    };
  };


  _this.initAll = function ( stats, cb ) {
    if ( !stats ) {
      stats = {
        sigma: [ ],
        media: [ ],
        N: [ ]
      };
    }
    let sigma = stats.sigma;
    let media = stats.media;
    let N = stats.N;
    let n = media.length;
    let V_T = new AL.matrix.diagonal( n, n );
    let S = new AL.matrix.create( n, 1, function ( i ) {
        return sigma[ i ];
      } )
      .trans( );
    let promise = new Promise( function ( full, rej ) {
      riemann.Modelstats.findOne( {}, function ( error, stats ) {
        if ( error ) {
          debug.error( 'error on find stats:', error );
        }
        if ( !stats ) {
          rej( error );
        } else {
          full( stats );
        }
      } );
    } );
    promise.then(
      function _full( stats ) {
        if ( typeof cb === 'function' ) {
          return cb( stats )
        }
      },
      function _rej( e ) {
        debug.error( 'error on promise of initall or stats not found:', e )
        riemann.Modelstats.create( {
            sigma: sigma,
            media: media,
            N: N
          },
          function ( err, stats_created ) {
            if ( err ) {
              debug.error( 'error on create stats:', err );
            } else {
              debug.info( 'stats created into initall:', stats_created );
            }
            console.log( 'antes de crear pca ' );
            modelof_pca_system.findOne( {}, function ( arr, pca ) {
              console.log( 'arr, pca', arr, pca );
              if ( arr ) {
                debug.error( 'error on find pca:', arr );
              }
              if ( !pca ) {
                modelof_pca_system.create( {
                  V_T_matrix: V_T.array,
                  S_vector: S.array[ 0 ]
                }, cb );
              } else {
                if ( typeof cb === 'function' ) {
                  cb( );
                }
              }
            } );
          } );
      } )
    return _this;
  };
  return _this
}