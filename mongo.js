var mongo = require('mongoskin');
var Server = mongo.Server;
var Db = mongo.Db;

var mngUrl = process.env.MONGOSOUP_URL || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGODB_URL;
var db = mongo.db(mngUrl, {native_parser:true});

module.exports = db;
