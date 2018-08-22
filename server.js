var express = require('express')
var path = require('path')
var app = express()
var https = require('https')
var fs = require('fs')
app.use(express.static(path.join(__dirname,'/views')))
// app.use(express.static(path.join(__dirname,'/certificates')))

app.get('/', function(req, res){

    res.sendFile(__dirname,'/index.html')
})

const httpsOptions = {
    key : fs.readFileSync(path.join(__dirname, 'certificates','private.pem')),
    cert : fs.readFileSync(path.join(__dirname, 'certificates','certificate.pem')),
}


https.createServer(httpsOptions, app).listen(443, function(res){
    console.log('https://localhost')
})
// app.listen(8000,console.log('http://localhost:8000'))