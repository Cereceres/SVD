'use strict';

//Curie calculate the probability of data given
let newton = require( 'bindings' )( 'newton' );
let Riemann
let riemann
let pcamodel
let debug = require( '../debug' )
let statsmodel
let p_x = newton.p_x;
let uprade_pca = require( '../Darwin/darwin' ).pca_sample;


let Pca_analysis = function ( V_matrix, S_vector, _stats ) {
  this.V = V_matrix;
  this.S = S_vector;
  this.stats = _stats;
  this.p_x = ( function ( analytic ) {
    return p_x( this.V, analytic, this.S, this.stats );
  } ).bind( this );

};

let Pca_analytic = function ( timeupgrade, sizesample, options, mongoose ) {
  Riemann = require( '../Riemann/riemann' );
  riemann = new Riemann( mongoose );
  pcamodel = riemann.modelof_pca_system( );
  statsmodel = riemann.Modelstats;
  this.pca_lets = {
    V_T: [ ],
    S: [ ],
    stats: [ ]
  };
  //if the time arguments is passed the upgrade methos is exec
  if ( timeupgrade ) {
    this.timeupgrade = timeupgrade;
  }
  if ( sizesample ) {
    this.sizesample = sizesample;
  }
  if ( options ) {
    this.options = options;
  }
  let _this = this;
  // the upgrade method
  this.upgrade = function ( timeupgrade, sizesample, options ) {
    if ( timeupgrade ) {
      _this.timeupgrade = timeupgrade;
    }
    if ( sizesample ) {
      _this.sizesample = sizesample;
    }
    if ( options ) {
      _this.options = options;
    }

    uprade_pca( _this.timeupgrade, _this.sizesample, _this.options );
  };

  this.stop = function ( ) {
    uprade_pca.stop( );
  };
  // the callback receive the p_x function as argument.
  this.pca = function ( cb ) {
    statsmodel.findOne( {}, function ( err, stats ) {
      if ( err || !stats ) {
        debug.Curie.error( 'error to find stats:', err )
      }
      if ( stats ) {
        debug.Curie.info( 'the stats found was:', stats )
        _this.pca_lets.stats = [ stats.media, stats.sigma ];
        pcamodel.findOne( {}, function ( error, pca ) {
          if ( pca ) {
            _this.pca_lets.V_T = pca.V_T_matrix;
            _this.pca_lets.S = pca.S_vector;
            pca = new Pca_analysis( _this.pca_lets.V_T, _this.pca_lets
              .S, _this.pca_lets.stats );
            cb( pca.p_x );
          }

        } );
      }
    } );
  };
};




module.exports = Pca_analytic;