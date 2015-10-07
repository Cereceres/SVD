var addon = require('bindings')('addon');
var fn = addon();
fn([7,5,6]); // 'hello world'
