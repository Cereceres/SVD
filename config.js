'use strict';

module.exports = require('rc')('newton', {
  mongo: {
    url:'mongodb://localhost/newton',
    db: 'newton',
    host: 'localhost',
    user: '',
    pass: ''
  }
});
