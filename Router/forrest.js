const express = require('express')

var app = express()
const mongoClient = require('../Database/mongo.js')

// Forrest Add Hall Details.......
app.post('/forrest/add_hall_detail', function(req, res){
    let body = req.body
    console.log("body")
    console.log(body)
    mongoClient.hall_details.findOneAndUpdate({"_id" : body._id,},{$set :{
        name : body.name,
        head : body.head,
        prime : body.prime,
        seats : body.seats,
        ac : body.ac,
        projectors : body.projectors,
        bookings : {}
    }},{upsert:true})
    .then((data)=>{res.send(data)})
    .catch((err)=>{console.log(err)
    res.status(500).send("correction shld noted")})
})

// Forrest Srec-shb main page -- little infos : {Name, Hall Title, Pic}
app.post('/forrest/homepage/feed/add', function (req, res) {
   mongoClient.shb_home_page.findOneAndUpdate({_id : req.body._id},{$set : {head: req.body.head,title :req.body.title,}},{upsert:true})
    .then((dat)=>{
        console.log(dat)
        res.status(202).send("Forrest Okay")
    }).catch((err)=>{
        console.log(err)
        res.send("okay added")
    })
})
// adding admin or super admin accounts by foorest based on role they will be traeated
app.post('/forrest/include/account', function (req, res) {
    console.log(req.body.email)
    console.log(req.body.role)
    console.log(req.body.hall_id)
    mongoClient.forrest_accounts.findOneAndUpdate({email : req.body.email},{$set :{role :req.body.role,hall_id : req.body.hall_id}},{upsert:true})
    .then((out)=>{
        console.log(out)
        res.status(200).send(out)
    })
    .catch((e)=>{
        console.log(e)
        res.send("Wrong acc forrest")
    })
  })


  
module.exports = app



// app.post('/forrest/dummy/super-admin/approved/add', function (req, res) {
//     const jsonIn = {
//         "_id" : req.body.hall_id,
//         "email" : req.body.email,
//     "bookings" : {
//             "date_container" : {
//                 "date" : req.body.date,
//                 "sessions" : {
//                     "session_id" : req.body.session_id,
//                     "status" : req.body.status,
//                     "book_desc" : req.body.book_desc,
//                     "by" :req.body.by 	
//                  },
//             }}
//      }
//      console.log(jsonIn.bookings.date_container)
//      mongoClient.superadmin_accounts.updateMany({hall_id : req.body.hall_id},{
//         $addToSet : {approved : jsonIn.bookings.date_container}
//     }).then((dat)=>{
//         res.send(dat)
//     }).catch((er)=>{
//         res.send(er)
//     })
//   })

// //   temporary for forrest add fake admin account for Booking process
// app.post('/forrest/dummy/include/admin_acc', function (req, res) {
//     console.log("Admin")
    
//     new mongoClient.admin_account({
//         name : req.body.name,
//         email : req.body.email,
//         role : 1,
//         device_token : req.body.device_token,
//     }).save().then((fine)=>{
//         console.log(fine)
//         res.status(201).send("created admin")
//     }).catch((e)=>{
//         console.log(e)
//         res.status(406).send("Not Accepted ad")
//     })
//   })


// //   temporary for forrest add fake Super-admin account for Booking process
// app.post('/forrest/dummy/include/super_admin_acc', function (req, res) {
//     console.log("Admin")
    
//     new mongoClient.superadmin_accounts({
//         name : req.body.name,
//         email : req.body.email,
//         role : 1,
//         hall_id : req.body._id,
//         device_token : req.body.device_token,
//     }).save().then((fine)=>{
//         console.log(fine)
//         res.status(201).send("created super admin")
//     }).catch((e)=>{
//         console.log(e)
//         res.status(406).send("Not Accepted ad")
//     })
//   })
