const controller = require("./controller") ;
const fs = require("fs");
const csv = require('csv-parser');

var filepath = process.argv[2];
const results = [];
fs.createReadStream(filepath).pipe(csv()).on('data',(data)=>results.push(data))
    .on('end', () => {
        fs.unlink(filepath);
        var sendArray = []
        results.forEach(item=>{
            sendArray.push({
                teamName : item.name,
                members : item.members,
                managers : item.manager,
                teamOwner : item.phone_no
            });
        });
        controller.BulkAddTeams(sendArray,
            (Saved)=>{
                // console.log(Saved)
                console.log("Data saved")
                process.exit(0);
            },
            (err)=>{
                console.error(err)
        });
    });