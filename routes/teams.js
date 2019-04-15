const router = require('express').Router();
const multer = require('multer');
const uploads = multer({dest :'uploads/'});
const fs = require('fs');

const q = require('childprocess-queue').newQueue();
q.setMaxProcesses(5);

router.post('/bulkUploadTeam',uploads.single('file'),(req,res)=>{
    if(q.getCurrentProcessCount()==5){
        return res.status(400).json({
            message :"Sorry! All the processors are busy at the moment. Please try again later."
        })
    }else if(q.getCurrentProcessCount()<5){
        fs.createReadStream(req.file.path);
        q.spawn('node',['processor/team-processor.js',req.file.path],{
            detached: false, //if not detached and your main process dies, the child will be killed too
            stdio: [process.stdin, process.stdout, process.stderr] //those can be file streams for logs or wathever
        });
        var processCount = q.getCurrentProcessCount();
        var queueSize = q.getCurrentQueueSize();
        // if(processCount <= 5 && queueSize==0){
            // pick the last one and send the pid
            var processes = q.getCurrentProcesses();
            // console.log(processes[processCount-1].pid)
            var pid = processes[processCount-1].pid;
            return res.status(202).json({
                message : "Request accepted succesfully and is being processed.",
                pid : pid,
                remaining :  5- processCount
            })
        // }else {
        //     // var queueID = q.removeFromQueue()
        //     console.log(id)
        //     return res.status(202).json({
        //         message : "Request accepted succesfully and is queued.",
        //         qid : id.id
        //     })
        // }
    }

    

});

router.post('/stopProcess/:pid',(req,res)=>{
    var result = 0;
    for(var i=0;i<q.getCurrentProcessCount();i++){
        if(q.getCurrentProcesses()[i].pid == req.params.pid){
            // console.log(q.getCurrentProcesses()[i])
            process.kill(req.params.pid);
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

router.post('/checkProgress/:pid',(req,res)=>{
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