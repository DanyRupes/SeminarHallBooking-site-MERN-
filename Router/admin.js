var express = require('express')
var app = express()
const mongoClient = require('../Database/mongo.js')

// super-admin inbox
app.post('/admin/pendings', function(req,res){
    console.log(req.body.email)
    mongoClient.admin_accounts.findOne({email:req.body.email},{pendings :1})
    .then((details) => {
        console.log("details"+details.pendings)
        res.send(details.pendings) ///inbpx array
    }).catch((err) => {
        res.send(err)
    });
})
 
//  super-admin approved lists
app.post('/admin/booked', function(req,res){
    console.log(req.body.email)
    mongoClient.admin_accounts.findOne({email:req.body.email},{booked :1})
    .then((data) => {
        //        console.log("data"+data.approved)
                console.log(data.booked)
                res.send(data.booked)
        
    }).catch((err) => {
        res.send(err)
    });
})


// super-admin get Account details
app.post('/admin/account', function(req,res){
    console.log(req.body.email)
    mongoClient.admin_accounts.findOne({email:req.body.email})
    .then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });
})

module.exports = app