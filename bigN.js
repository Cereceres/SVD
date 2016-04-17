'use strict'
class bigN {
  constructor( number ) {
    number = number || 0
    this.number = number.toString( ).split( '.' )
    this.decimal = this.number[ 0 ] || [ 0 ]
    this.Numdecimal = this.decimal.length - 1
    this.number = this.number[ 0 ]
  }
  add( number ) {
    let num = number.toString( ).split( '' )
    let max = this.number.length > num.length ? this.number.length : num.length
    let res = [ ],
      a, b
    for ( var i = 1; i <= max; i++ ) {
      a = this.number[ ( this.number.length - i ) ] === undefined ? +( this.number[
        this.number.length - i ] ) : 0
      b = num[ num.length - i ] === undefined ? +( num[ num.length - i ] ) :
        0
      res[ max - i ] = a + b

    }
    this.number = res
    return this
  }
  multiply( number ) {
    let num = number.toString( ).split( '' )
    let max = num.length + this.number.length
    let res = [ ],
      _res,
      a, b, c
    for ( var i = 1; i <= this.number.length; i++ ) {
      _res = 0
      a = +( this.number[ this.number.length - i ] )
      for ( var j = 1; j <= num.length; j++ ) {
        b = +( num[ num.length - j ] ? num[ num.length - j ] : 0 )
        c = i === 1 ? 0 : +( res[ max - j - i + 1 ] ) || 0
        res[ max - j - i + 1 ] = a * b + _res + c
        if ( res[ max - j - i + 1 ] > 9 && j !== num.length ) {
          _res = Math.floor( res[ max - j - i + 1 ] / 10 )
          res[ max - j - i + 1 ] = res[ max - j - i + 1 ] % 10
        } else if ( res[ max - j - i + 1 ] > 9 && j === num.length ) {
          res.splice.apply( res, [ max - j - i + 2 - res[ max - j - i + 1 ].toString( )
            .length, res[ max - j - i + 1 ].toString( )
            .length
          ].concat( res[ max - j - i + 1 ].toString( ).split( '' ) ) );
        }
      }
    }
    this.number = res
    return this
  }
  rest( number ) {
    let num = number.toString( ).split( '' )
    let max = this.number.length > num.length ? this.number.length : num.length
    let res = [ ],
      a, b
    for ( var i = 1; i <= max; i++ ) {
      a = this.number[ ( this.number.length - i ) ] === undefined ? +( this.number[
        this.number.length - i ] ) : 0
      b = num[ num.length - i ] === undefined ? +( num[ num.length - i ] ) :
        0
      res[ max - i ] = a + b

    }
    this.number = res
    return this
  }
  div( number ) {
    let num = number.toString( ).split( '' ),
      min, max
    max = this.number.length
    min = num.length
    let dif = max - min;
    dif = dif < 0 ? 0 : dif
    let res = [ ],
      a, b, _res
    a = +( this.number.slice( 0, ( dif = 0 ) ? max : min ).join( '' ) )
    b = +( number )
    for ( var i = 0; i <= dif; i++ ) {
      res[ i ] = Math.floor( a / b )
      _res = a - b * res[ i ]
      a = +( _res.toString( ).concat( this.number[ i + min ] ||
        0 ) )
    }
    this.number = res
    res = [ ]
    for ( i = 0; i < this.Numdecimal; i++ ) {
      res[ i ] = Math.floor( a / b )
      _res = a - b * res[ i ]
      a = +( _res.toString( ).concat( this.number[ i + max ] ||
        0 ) )
    }
    this.decimal = res
    return this

  }
}


console.log( '234343'.split( '.' ) )