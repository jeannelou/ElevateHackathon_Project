var express = require('express')
var app = express()
var fs = require('fs')
var helper = require('./utils/helpers')
app.use('/',express.static(__dirname+"/public"))
var server = app.listen(8085,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s",host ,port)
})

app.get('/ChildCare',function(req,res,next){

    fs.readFile('public/child-care-json.json',function(err,data){
        if (err){
            console.error(err)
        }
        res.send(data)
        res.end()
    })
})

app.get('/event',function(req,res,next){
    res.sendFile(__dirname+"/public/event.html")
})