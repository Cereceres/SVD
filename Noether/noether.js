'use strict';
//var Noether = require('./build/Release/Noether');
var Noether = Math;
var sqrt3 = Math.sqrt(3), _sqrt3 = 2 * sqrt3, pi_2 = Math.PI / 2;

//Noether take a sample from DB of observations
module.exports.plugin = exports = function(schema) {
  schema.statics.findRandom = function(conditions, fields, options, callback) {
    var args = checkParams(conditions, fields, options, callback);

    var limit = 1;
    var populate;

    if (args.options.limit) {
      limit = args.options.limit;
      delete args.options.limit;
    }

    if (args.options.populate) {
      populate = args.options.populate;
      delete args.options.populate;
    }

    var _this = this;

    _this.count(args.conditions, function(err, num) {
      if (err) {
        return args.callback(err, undefined);
      }

      if (limit > num) {
        limit = num;
      }
      var start, docs = [];
      args.options.limit = 1;
      var i =0;
      var look = function ( ) {
        i++;
        if (i<= limit) {
          start = Math.floor(Noether.random()*num)+1;
          args.options.skip = start;

          var find = _this.find(args.conditions, args.fields, args.options);
          if (populate) {
            find.populate(populate);
          }
          find.exec(function(err, doc) {
            if (err) {
              return args.callback(err, undefined);
            }
            docs.push(doc[0]);
            look();
          });
        }else {
          return args.callback(undefined, docs);
        }
      };
      look();
    });
  };

  schema.statics.findOneRandom = function(conditions, fields, options, callback) {
    var args = checkParams(conditions, fields, options, callback);
    var populate;

    if (args.options.limit) {
      delete args.options.limit;
    }

    if (args.options.populate) {
      populate = args.options.populate;
      delete args.options.populate;
    }

    var _this = this;

    _this.count(args.conditions, function(err, num) {
      if (err) {
        return args.callback(err, undefined);
      }

      var start = Math.floor(num * Noether.random());
      args.options.skip = start;
      var find = _this.findOne(args.conditions, args.fields, args.options);
      if (populate) {
        find.populate(populate);
      }

      find.exec(function(err, doc) {
        if (err) {
          return args.callback(err, undefined);
        }

        return args.callback(undefined, doc);
      });
    });
  };

  var checkParams = function(conditions, fields, options, callback) {
    if (typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
      fields = {};
      options = {};
    } else if (typeof fields === 'function') {
      callback = fields;
      fields = {};
      options = {};
    } else if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (options.skip) {
      delete options.skip;
    }

    return {
      conditions: conditions,
      fields: fields,
      options: options,
      callback: callback,
    };
  };
};

module.exports.random = function(a, b) {
  if (a === undefined || b === undefined) {return Noether.random();}

  if (b === a) {return 0;}

  if (a > b) {
    var c = b; b = a;a = c;
  }

  return (b - a) * Noether.random() + a;
};

module.exports.r_uniform = function(mu, sigma) {
  return mu - sqrt3 * sigma + _sqrt3 *  Noether.random()  *
   sigma * Math.sin(pi_2 *  Noether.random());
};
