var express = require('express')
var path = require('path')
var app = express()

app.use(express.static(path.join(__dirname,'/views')))

app.get('/', function(req, res){

    res.sendFile(__dirname,'/index.html')
})

app.listen(8000,console.log('http://localhost:8000'))