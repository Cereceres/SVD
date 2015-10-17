'use strict';
  var   mongoose = require('./mongoose');


    var Statsaving= function (namedata, namestats) {
    var doc;
    var Schema = mongoose.Schema;
    this.schemadata =  new Schema({
    data : Array
    });
    this.Modeldata = mongoose.model(namedata,this.schemadata);
    this.schemastats =  new Schema({
      sigma : Array ,
      media : Array,
      N : Number,
    });
    this.Modelstats = mongoose.model(namestats,this.schemastats);
    this.create = function (tosave,cb) {
    doc = new this.Modeldata(tosave);
    this.Modelstats.find.call({ doc:doc, cb :cb},{},function(error,stats) {
        var l = stats.length;
        for (var i = 0; i < l; i++) {
            stats.media[i] =(stats.media[i]*stats.N[i]+this.doc.data[i])/(stats.N[i]+1);
            stats.sigma[i] =Math.sqrt((stats.sigma[i]*stats.sigma[i]*(stats.N[i]-1)+(this.doc.data[i]-stats.media[i])*(this.doc.data[i]-stats.media[i]))/(stats.N[i]));
            (stats.N[i])++;
        }
        this.doc.save.call({cb:this.cb,stats:stats},function (err) {
          this.stats.save(this.cb);
        });
    });
  };

};

module.exports.Statsaving = Statsaving;
