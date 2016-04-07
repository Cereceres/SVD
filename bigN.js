'use strict'
class bigN {
  constructor( number ) {
    number = number || 0
    this.number = number.toString( ).split( '' )
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
  }
  multiply( number ) {
    let num = number.toString( ).split( '' )

  }
  rest( number ) {
    let num = number.toString( ).split( '' )

  }
  div( number ) {
    let num = number.toString( ).split( '' )

  }
}

console.log( new bigN( 3453454 ).number );

console.log( -3 % 6 );