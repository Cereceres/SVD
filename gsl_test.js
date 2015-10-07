var addon = require('bindings')('addon');

var fn = addon();
fn(); // 'hello world'
