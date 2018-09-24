var express = require('express')
var path = require('path')
var app = express()
var https = require('https')
var fs = require('fs')


var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended : true}))
app.use(bodyparser.json())


app.use(express.static(path.join(__dirname,'/views'))) // html pages
app.use(express.static(path.join(__dirname,'/verifications')))
app.get('/', function(req, res){
    console.log("hi")
    // res.sendFile(__dirname,'/index.html')
    res.send("hello Java")
})

var super_admin = require('./Router/super_admin.js')
var admin_book = require('./Router/admin_book.js')
var shb_verifyer = require('./Router/shb_verifyer.js')
var common = require('./Router/common.js')
var forrest = require('./Router/forrest.js')
var approval = require('./Router/approval.js')
var admin = require('./Router/admin.js')
app.use('/',super_admin)
app.use('/',admin_book)
app.use('/',shb_verifyer)
app.use('/',common)
app.use('/',forrest)
app.use('/',approval)
app.use('/',admin)


// i have no desire to own you, to claim you. i love you just as you are . free your own.git 

const httpsOptions = {
    ca : fs.readFileSync(path.join(__dirname, 'certificates/additional','single.crt')),
    cert : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','certificate.crt')),
    key : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','private.key')),
    // ca : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','ca_bundle.crt')),
}
// https.createServer(httpsOptions, app).listen(443, function(res){
//     console.log('https://localhost')
//  })
app.listen(11000,console.log('http://localhost:11000'))



// app.get('/verify/shb_user/:id', function(req, res){
     
//     // console.log(req.param('token_id'))  https://localhost/verify/shb_user?token_id=34653634573467
// //    console.log(req.param('id'))  https://localhost/verify/shb_user/34653634573467
//     // verifyAuth()
    
//     res.send("okay")    
    
// })


