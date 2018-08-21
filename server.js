var express = require('express')
var app = express()

app.use('./views')

app.get('/', function(req, res){

    res.sendFile(__dirname,'/index.html')
})