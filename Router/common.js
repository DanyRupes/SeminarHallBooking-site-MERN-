const express = require('express')

var app = express()
const mongoClient = require('../Database/mongo.js')


app.get('/shb/homepage/feed/common', function (req, res) { 
    mongoClient.shb_home_page.find(function (err, data) { 
        if(err){
            console.log(err)
            res.status(401).send("bad")
        }
        else {
            res.status(200).send(data)
        }
     })
 })

 app.post('/users/hall/id/', function(req, res){
    // console.log(req)
    mongoClient.hall_details.findOne({_id : req.body.hall_id}, function(err, data){
        if(err){
            console.log(err)
            res.status(203).send("Non-Authoritative Information")
        }
        else {
            console.log(data)
            data.bookings = undefined   ///speedy
            res.send(data)
        }
    })
})

//  getting particular date sessions details..
app.post('/shb/hall/id/bookings/date', function (req, res) { 
    // console.log(req.body)
    console.log(req.body.hall_id)
    console.log(req.body.date)
    mongoClient.hall_details.findOne({_id : req.body.hall_id,"bookings.date_container.date":req.body.date},{"bookings.date_container.sessions.$":1},function(err,data){
        if(err){
            console.log("err" +err)
            res.status(501).send("Not Implemented")  //internal  server error
        }else{
            if(data == null){
                res.status(901).send("No Data")   
            }else {
                console.log(data)//data.bookings.date_container[0].sessions
                let fin_data = data.bookings.date_container[0].sessions;
                res.status(302).send(fin_data)  //found .. sending list of sessions
            }
        }
    })
 })


module.exports =app