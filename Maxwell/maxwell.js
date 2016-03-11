'use strict';

//Maxwell take a sample from a DB

let A = [ ];
let debug = require( '../debug' )
let options = {
  limit: 0
};
let sample = function ( Nsample, cb ) {
  let Riemann = require( '../Riemann/riemann' );
  let riemann = new Riemann( );
  let data_model = riemann.Modeldata;
  options.limit = Nsample;
  // console.log('the sample size is',Nsample);
  data_model.findRandom( {}, {}, options,
    function ( error, res ) {
      if ( error ) {
        debug.Maxwell.error( 'error  ', error );
        return;
      }
      res.forEach( function ( item ) {
        if ( item.data.length > 0 ) {
          A.push( item.data );

        }
      } );
      cb( A );
      A = [ ];
    } );
};
module.exports.sample = sample;