var express = require('express')
var app = express()
const mongoClient = require('../Database/mongo.js')

// super-admin inbox
app.post('/super_admin/inbox', function(req,res){
    console.log(req.query.hall_id)
    mongoClient.superadmin_accounts.findOne({hall_id:req.query.hall_id},{inbox :1})
    .then((details) => {
        console.log("details"+details.inbox)
        res.send(details.inbox) ///inbpx array
    }).catch((err) => {
        res.send(err)
    });
})
 
//  super-admin approved lists
app.post('/super_admin/approved', function(req,res){
    console.log(req.query.hall_id)
    mongoClient.superadmin_accounts.findOne({hall_id:req.query.hall_id},{approved :1})
    .then((data) => {
        //        console.log("data"+data.approved)
                console.log(data.approved)
                res.send(data.approved)
        
    }).catch((err) => {
        res.send(err)
    });
})


// super-admin get Account details
app.post('/super_admin/account', function(req,res){
    console.log(req.query.hall_id)
    mongoClient.superadmin_accounts.findOne({hall_id:req.query.hall_id,email:req.query.email},{approved :1})
    .then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });
})












module.exports = app
