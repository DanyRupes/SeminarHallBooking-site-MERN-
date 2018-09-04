var express = require('express')
var app = express()
const mongoClient = require('../Database/mongo.js')

// super-admin inbox
app.post('/super_admin/inbox', function(req,res){
    console.log(req.query.hall_id)
    mongoClient.superadmin_account.findOne({hall_id:req.query.hall_id},{inbox :1})
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
    mongoClient.superadmin_account.find({hall_id:req.query.hall_id},{approved :1})
    .then((data) => {
        //        console.log("data"+data.approved)
                console.log("data.approved"+data.approved)
                res.send(data.approved)
        
    }).catch((err) => {
        res.send(err)
    });
})


// super-admin get Account details
app.post('/super_admin/account', function(req,res){
    console.log(req.query.hall_id)
    mongoClient.superadmin_account.findOne({hall_id:req.query.hall_id,email:req.query.email},{approved :1})
    .then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });
})


//  Super Allow or Disallow Admin process
app.get('/super_admin/approve/event', function(req, res){

    // gettting from inbox and moving to approved bucket
    mongoClient.superadmin_account.findOneAndUpdate({"inbox._id":req.body._id},{
    },{"inbox.$":1})
})





app.post('/forrest/dummy/super-admin/approved/add', function (req, res) {
    const jsonIn = {
        "_id" : req.body.hall_id,
        "email" : req.body.email,
    "bookings" : {
            "date_container" : {
                "date" : req.body.date,
                "sessions" : {
                    "session_id" : req.body.session_id,
                    "status" : req.body.status,
                    "book_desc" : req.body.book_desc,
                    "by" :req.body.by 	
                 },
            }}
     }
     console.log(jsonIn.bookings.date_container)
     mongoClient.superadmin_account.updateMany({hall_id : req.body.hall_id},{
        $addToSet : {approved : jsonIn.bookings.date_container}
    }).then((dat)=>{
        res.send(dat)
    }).catch((er)=>{
        res.send(er)
    })
  })

module.exports = app
