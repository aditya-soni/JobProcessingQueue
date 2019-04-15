const Team = require("../models/teams") ;
// const {mongoose} = require("./mongoose");

module.exports.BulkAddTeams = function (teams,callback,err){
    // let session = null;
    // mongoose.startSession().then(
    //     _session =>{
    //         session = _session;

    //         session.startTransaction();


            var teams_arr = [];

            teams.forEach(team => {
                let newTeam =  new Team({
                    teamName : team.teamName,
                    members :team.members,
                    managers : team.managers,
                    teamOwner : team.teamOwner
                });
                teams_arr.push(newTeam);
                
            });
        
            Team.insertMany(teams_arr,(error,docs)=>{
                if(error) {
                    // session.abortTransaction()
                    err(error);
                }else{
                    callback(docs);
                }
            })
            // .session(session);
}

module.exports.GetData = function(fromDate,callback,err){
    Team.find({updatedAt : {$gte : new Date(fromDate)} }).then(
        (data)=>{
            if(!data){
                err("Sorry no data found!")
            }else {
                callback(data)
            }
        }
    )
}

