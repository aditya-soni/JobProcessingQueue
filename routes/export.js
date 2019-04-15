const router = require('express').Router();

const q = require('childprocess-queue').newQueue();
q.setMaxProcesses(5);

router.post('/data',(req,res)=>{
    var fromDate = req.body.fromDate;

    q.spawn('node',['processor/export-data-processor.js',fromDate],{
        detached : false,
        stdio : [process.stdin,process.stdout,process.stderr]
    });
    
    
    var processCount = q.getCurrentProcessCount();
    var processes = q.getCurrentProcesses();
    var pid = processes[processCount-1].pid;
    return res.status(202).json({
        message : "Exporting is started will get back to you!",
        pid : pid
    })
});

router.post('/stop/:pid',(req,res)=>{
    var result = 0;
    for(var i=0;i<q.getCurrentProcessCount();i++){
        if(q.getCurrentProcesses()[i].pid == req.params.pid){
            // console.log(q.getCurrentProcesses()[i])
            var filepath = q.getCurrentProcesses()[i].spawnargs[2];
            q.getCurrentProcesses()[i].kill('SIGTERM');
            result = 1;
            break;
        }
    }
    if(result == 1){    
        return res.status(200).json({
            message: "Process has been stopped!",
            
        });
    }else {

        res.status(404).json({
            message: "Process not found."
        });
    }
});

router.post('/checkStatus/:pid',(req,res)=>{
    var result = 0;
    for(var i=0;i<q.getCurrentProcessCount();i++){
        if(q.getCurrentProcesses()[i].pid == req.params.pid){
            result = 1;
            break;
        }
    }
    if(result == 1){
        res.status(200).json({
            message: "The process is still running."
        });
    }else{
        res.status(404).json({
            message: "Process not found or has ended"
        });
    }
});


module.exports = router;