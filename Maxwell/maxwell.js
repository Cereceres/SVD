'use strict';

//Maxwell take a sample from a DB

let A = [ ];
let debug = require( '../debug' )
let sample = function ( Nsample, conditions, fields, options, cb ) {
  let Riemann = require( '../Riemann/riemann' );
  let data_model = Riemann.Modeldata;
  options.limit = options.limit || Nsample;
  // console.log('the sample size is',Nsample);
  data_model.findRandom( conditions, fields, options,
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