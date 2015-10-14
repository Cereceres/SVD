'use strict';

  var   mongoose = require('./mongoose');
  var random = require('mongoose-simple-random');
  var   schema ;
    /** schema of fit. */
  schema =  new  mongoose.Schema({
    data : Array
  });
  schema.plugin(random);
    /** fit Model */
module.exports = mongoose.model('data', schema);
