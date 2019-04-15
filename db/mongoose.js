const mongoose = require('mongoose');
const config =require("../config/environments/development");
mongoose.Promise = global.Promise;

mongoose.connect(config.mongoURL,{useNewUrlParser:true});
module.exports = { mongoose };