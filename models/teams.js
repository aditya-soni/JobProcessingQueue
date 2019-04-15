const mongoose = require("../db/mongoose").mongoose;
var Schema = mongoose.Schema;

var teamsSchema = new Schema(
    {
    teamName :{
        type : String,
        required : true
    },
    members : {
        type : String,
        default : []
    },
    managers : {
        type : String,
        required : true
    },
    teamOwner : {
        type : String,
        required : true
    }
    },
    {
        timestamps : true
    }
);

var Teams = mongoose.model('Team',teamsSchema);
module.exports = Teams;

