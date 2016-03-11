'use strict';
let newton = require( 'bindings' )( 'newton' );
let gsl_pca = newton.pca;
let Riemann
let pcamodel
let riemann
let debug = require( '../debug' )
let statsmodel
let samplig = require( '../Maxwell/maxwell' ).sample;
let pca;
// make the stats into de data to generate
// the pca_system into the DB
let pca_sample = function ( timeupgrade, sizesample, options, config ) {
  Riemann = require( '../Riemann/riemann' );
  riemann = new Riemann( config );
  pcamodel = riemann.modelof_pca_system( );
  statsmodel = riemann.Modelstats;
  options = options || {
    limit: 0.75
  };
  let limit = options.limit;
  debug.Darwin.info( 'upgrading from darwin' );
  // save the setIntervalID to stop it.
  let tostop = setInterval( function ( ) {
    // the sample is taken
    samplig( sizesample, function ( Sample ) {
      debug.Darwin.info( 'sample found is:', Sample.length )
      if ( !Sample.length ) {
        return;
      }
      if ( Sample.length ) {
        if ( Sample.length <= Sample[ 0 ].length ) {
          return;
        }
      }

      // find the stats into de DB
      statsmodel.findOne( {}, function function_name( err, stats ) {
        if ( err || stats ) {
          debug.Darwin.error( 'Error on findOne stats', err );
        }
        // with the sample and stats make the pca analysis
        if ( stats ) {
          debug.Darwin.info( 'the stats found is:', stats )
          pca = gsl_pca( Sample, limit, [ stats.media, stats.sigma ] );
          pcamodel.findOneAndUpdate( {}, {
            V_T_matrix: pca.V_trans,
            S_vector: pca.S_corr
          }, {
            new: true,
            upsert: true
          }, function ( error ) {
            // if the pca doc does not exist, is created
            if ( error ) {
              debug.Darwin.error( 'error on update pca :',
                error );
            }


          } );
        }
      } );
    } );
  }, timeupgrade );

  pca_sample.tostop = tostop;
};
// bind the stop method
pca_sample.stop = function ( ) {
  clearInterval( pca_sample.tostop );
};

module.exports.pca_sample = pca_sample;