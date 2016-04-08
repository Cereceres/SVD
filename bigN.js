'use strict'
class bigN {
  constructor(number) {
    number = number || 0
    this.sign = 1
    let str = number.toString();
    this.number = str.split('')
  }
  add(number) {
    let num = number.toString().split('')
    let max = this.number.length > num.length ? this.number.length : num.length
    let a, b
    let _res = 0,
      res = []
    for (var i = 1; i <= max; i++) {
      a = this.number[this.number.length - i] !== undefined ? +(this.number[
        this.number.length - i]) : 0
      b = num[num.length - i] !== undefined ? +(num[num.length - i]) : 0
      res[max - i] = a + b + _res;
      if (res[max - i] > 9) {
        _res = 1
        res[max - i] = res[max - i] % 10
      } else {
        _res = 0
      }
    }
    delete this.number
    this.number = res
    return this
  }
  multiply(number) {
    let num = number.toString().split('')
    let max = this.number.length + num.length
    let a, b
    let _res = 0,
      res = []
    for (var i = 1; i <= this.number.length; i++) {
      a = +(this.number[this.number.length - i])
      for (var j = 1; j <= num.length; j++) {
        b = +(num[num.length - j])
        res[max - i] = a * b + _res;
        if (res[max - i] > 9) {
          _res = Math.floor(res[max - i] / 10)
          res[max - i] = res[max - i] % 10
        } else {
          _res = 0
        }
      }

    }
    delete this.number
    this.number = res
    return this

  }
  rest(number) {
    let num = number.toString().split('')
    let max = this.number.length > num.length ? this.number.length : num.length
    let a, b
    let _res = 0,
      res = []
    for (var i = 1; i <= max; i++) {
      a = this.number[this.number.length - i] !== undefined ? +(this.number[
        this.number.length - i]) : 0
      b = num[num.length - i] !== undefined ? +(num[num.length - i]) : 0
      res[max - i] = a + b + _res;
      if (res[max - i] > 9) {
        _res = 1
        res[max - i] = res[max - i] % 10
      } else {
        _res = 0
      }
    }
    delete this.number
    this.number = res
    return this

  }
  div(number) {
    let num = number.toString().split('')
    let max = this.number.length > num.length ? this.number.length : num.length
    let a, b
    let _res = 0,
      res = []
    for (var i = 1; i <= max; i++) {
      a = this.number[this.number.length - i] !== undefined ? +(this.number[
        this.number.length - i]) : 0
      b = num[num.length - i] !== undefined ? +(num[num.length - i]) : 0
      res[max - i] = a + b + _res;
      if (res[max - i] > 9) {
        _res = 1
        res[max - i] = res[max - i] % 10
      } else {
        _res = 0
      }
    }
    delete this.number
    this.number = res
    return this

  }
}

console.log(new bigN(12).multiply(23).number);
