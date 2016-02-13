'use strict'
let debug = require( 'debug' )

/** Services to debug */
let services = [ 'Curie', 'Darwin', 'Maxwell', 'Noether', 'Riemann' ]

/** Set default debuggers */
let debuggers = debug( 'Newton' )
debuggers.error = debug( 'Newton:error' )
debuggers.info = debug( 'Newton:info' )

/** Set debuggers of services */
for ( let service of services ) {
  debuggers[ service ] = debug( service )
  debuggers[ service ].error = debug( `${service}:error` )
  debuggers[ service ].info = debug( `${service}:info` )
}

module.exports = debuggers