'use strict';
let newton = require( 'bindings' )( 'newton' );
let gsl_pca = newton.pca;
let Riemann
let pcamodel, usersModel
let debug = require( '../debug' )
let statsmodel
let sampling = require( '../Maxwell/maxwell' ).sample;
let pca;
// make the stats into de data to generate
// the pca_system into the DB
let pca_sample = function ( timeupgrade, sizesample, options ) {
  options.conditions = options.conditions || {}
  options.fields = options.fields || {}
  Riemann = require( '../Riemann/riemann' );
  pcamodel = Riemann.modelof_pca_system;
  statsmodel = Riemann.Modelstats;
  usersModel = Riemann.Modelowners;
  options.limit = options.limit || 0.75
  let limit = options.limit;
  debug.Darwin.info( 'upgrading from darwin' );
  // save the setIntervalID to stop it.
  let tostop = setInterval( function ( ) {
    // the sample is taken
    usersModel.find( {}, function ( users ) {
      if ( !users ) {
        debug.Darwin.info( 'There is not users to do upgrade' )

        return
      }
      for ( var i = 0; i < users.length; i++ ) {
        options.conditions.owner = users[ i ]
        sampling( sizesample, options.conditions, options.fields,
          options,
          function ( Sample ) {
            debug.Darwin.info( 'sample found is:', Sample.length )
            if ( !Sample.length ) {
              return;
            }
            //change here to use the algorithm to m<n
            if ( Sample.length <= Sample[ 0 ].length ) {
              debug.Darwin.info( 'sample is not enougth to do PCA',
                Sample.length )
              return;
            }
            // find the stats into de DB
            statsmodel.findOne( options.conditions, function (
              err,
              stats ) {
              if ( err || !stats ) {
                debug.Darwin.error( 'Error on findOne stats',
                  err );
                return
              }
              // with the sample and stats make the pca analysis
              if ( stats ) {
                debug.Darwin.info( 'the stats found is:', stats )
                try {
                  pca = gsl_pca( Sample, limit, [ stats.media,
                    stats.sigma
                  ] );
                } catch ( e ) {
                  debug.Darwin.error( 'gsl_pca:', e.stack )
                }
                pcamodel.findOneAndUpdate( options.conditions, {
                  V_T_matrix: pca.V_trans,
                  S_vector: pca.S_corr
                }, {
                  new: true,
                  upsert: true
                }, function ( error ) {
                  // if the pca doc does not exist, is created
                  if ( error ) {
                    debug.Darwin.error(
                      'error on update pca :',
                      error );
                  }


                } );
              }
            } );
          } );
      }
      options.conditions.owner = 0
      sampling( sizesample, options.conditions, options.fields,
        options,
        function ( Sample ) {
          debug.Darwin.info( 'sample found is:', Sample.length )
          if ( !Sample.length ) {
            return;
          }
          //change here to use the algorithm to m<n
          if ( Sample.length <= Sample[ 0 ].length ) {
            debug.Darwin.info( 'sample is not enougth to do PCA',
              Sample.length )
            return;
          }
          // find the stats into de DB
          statsmodel.findOne( options.conditions, function (
            err,
            stats ) {
            if ( err || !stats ) {
              debug.Darwin.error( 'Error on findOne stats',
                err );
              return
            }
            // with the sample and stats make the pca analysis
            if ( stats ) {
              debug.Darwin.info( 'the stats found is:', stats )
              try {
                pca = gsl_pca( Sample, limit, [ stats.media,
                  stats.sigma
                ] );
              } catch ( e ) {
                debug.Darwin.error( 'gsl_pca:', e.stack )
              }
              pcamodel.findOneAndUpdate( options.conditions, {
                V_T_matrix: pca.V_trans,
                S_vector: pca.S_corr
              }, {
                new: true,
                upsert: true
              }, function ( error ) {
                // if the pca doc does not exist, is created
                if ( error ) {
                  debug.Darwin.error(
                    'error on update pca :',
                    error );
                }
              } );
            }
          } );
        } );
    } )

  }, timeupgrade );

  pca_sample.tostop = tostop;
};
// bind the stop method
pca_sample.stop = function ( ) {
  clearInterval( pca_sample.tostop );
};

module.exports.pca_sample = pca_sample;