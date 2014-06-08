var mongo = require('mongoskin');
var Server = mongo.Server;
var Db = mongo.Db;

var db = mongo.db(process.env.MONGODB_URL, {native_parser:true});

module.exports = db;
