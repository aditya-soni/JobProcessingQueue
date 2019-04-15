const controller = require('./controller');
const child = require('child_process');
var fromDate = process.argv[2];
console.log(process.argv)
const results = [];

controller.GetData(fromDate,
    (data)=>{
        console.log(data) // this can be posted to user using request module
        process.exit(0);
    },
    err =>{
        console.err(err)
    }
    )