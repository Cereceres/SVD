'use strict';

  var   mongoose = require('./mongoose');
  var   schema ;
    /** schema of fit. */
  schema =  new  mongoose.Schema({
    data : Object
  });
    /** fit Model */
module.exports = mongoose.model('data', schema);
