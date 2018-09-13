var express = require('express')
var app = express()
var mongoClient = require('../Database/mongo.js')
var fbservice = require("../Firebase/srec-shb-firebase-adminsdk-yww66-5b9c3dbc69.json");

var fbadmin = require('firebase-admin')
// fbadmin.initializeApp({
//     credential : fbadmin.credential.cert(fbservice),
//     databaseURL : 'https://srec-shb.firebaseio.com'
// })

var messaging = fbadmin.messaging().app

    app.post('/super_admin/accept/session', function(req, res){

    ///getting inbox data
        mongoClient.superadmin_accounts.findOne({hall_id:req.body.hall_id,"inbox.date":req.body.date},{"inbox":1,"name":1})
        .then((suresult) => {
             console.log(suresult)
            var db_array = []
            var jingz_array = []
            // getting all db array and filtering for getting only out jingz array(approved)
            suresult.inbox.filter(function (val) { 
                if(val.sessions.session_id.toString() == req.body.session_id.toString() && val.date == req.body.date){
                    val.sessions.status = 1;
                    jingz_array = val
                }else {
                    db_array.push(val)
                }
            })
            //  Approving and removing =>approved and inbox-
                mongoClient.superadmin_accounts.findOneAndUpdate({hall_id:req.body.hall_id},{$set :{"inbox":db_array},$addToSet:{"approved":jingz_array}})
                    .then((div) => {
                        // res.send("Approved and removed from superadmin inbox ")
                        //              removing from halls_details and admin pendings
                        // console.log(jingz_array)
                            mongoClient.admin_accounts.findOne({email:jingz_array.email,"pendings.date":req.body.date},{"pendings":1})
                                .then((adjees) => {
                                    // console.log(adjees)
                                    
                                        var ad_db_array = []
                                        adjees.pendings.filter(function (toast) {
                                            // console.log(toast)
                                            // console.log(toast.sessions.session_id)
                                            if(toast.sessions.session_id.toString()==req.body.session_id.toString() && toast.date == req.body.date){}
                                            else {
                                                ad_db_array.push(toast);
                                            }
                                        })

                                        console.log("ad_db_array--!@#$%^&*&^%$#@")
                                        console.log(ad_db_array)
                                        //   adding to booked and removing from pendings
                                        mongoClient.admin_accounts.findOneAndUpdate({email:jingz_array.email},{$set :{"pendings":ad_db_array},$addToSet:{"booked":jingz_array}})
                                        .then((machi) => {
                                            console.log("machi+++++++++_+_+_+_+_+_+_+_")
                                            console.log(machi)

                                                    // setting status of hall_details status =1 #booked
                                                    mongoClient.hall_details.findOneAndUpdate({_id:req.body.hall_id,"bookings.date_container.date":req.body.date},{$unset:{"bookings.date_container.$":""}},
                                                    {projection:{"bookings.date_container.$":1}})
                                                        .then((rish) => {
                                                            console.log("rish )_)()(()(*()(*")
                                                            // console.log(rish)
                                                            console.log(rish.bookings.date_container[0])
                                                            
                                                            
                                                                    async function filterFine() { // array of objects 

                                                                    var advind =  await rish.bookings.date_container[0].sessions.map(function (aish) { 
                                                                        console.log("aish")
                                                                                console.log(aish.session_id.toString(),req.body.session_id.toString())
                                                                                console.log(aish.session_id.toString()==req.body.session_id.toString())
                                                                            if(aish.session_id.toString()==req.body.session_id.toString()){
                                                                                aish.status = 1; //booked
                                                                                delete aish._id
                                                                                console.log("yaaaaaaaaaaaaaaaaaaah ")
                                                                                return aish
                                                                            }else {
                                                                                delete aish._id
                                                                                return aish
                                                                            }
                                                                        })
                                                                        
                                                                        //  return advind;
                                                                        console.log("///////////////Async starting//////////// " + advind)
                                                                        // var temp_fine = {
                                                                        //     "sessions" : []
                                                                        // };
                                                                        // for(let cup=0;cup<advind.length;cup++){
                                                                    
                                                                        let  tempad =  {
                                                                            date : req.body.date,
                                                                            sessions : advind,
                                                                            }

                                    
                                                                        // }
                                                                        // res.send(tempad)
                                                                            console.log("tempad ")
                                                                            console.log(tempad)
                                                                        mongoClient.hall_details.findOneAndUpdate({_id:req.body.hall_id},{
                                                                            $addToSet :{"bookings.date_container":tempad}})
                                                                        .then((ac) => {
                                                                            console.log("all is fine----------")

                                                                           
                                                                            res.send(ac)
                                                                            //  return 1
                                                                        }).catch((tut) => {
                                                                            console.log(tut)
                                                                            console.log("tut")
                                                                            return "000"
                                                                        });
                                                                        // }
                                                                        }
                                                                        async function startNotifyAdmin() { 
                                                                            console.log("||||||||||||||  STARTING NOTIFY||||||||||")
                                                                            console.log(jingz_array.d_token)
                                                                            let message = {
                                                                                data : {
                                                                                    "title":"Hello "+machi.name,
                                                                                    "body":suresult.name +" has just Accepted your Bookings for "+jingz_array.sessions.by,
                                                                                    "code":"102",
                                                                                },
                                                                                "android" :{
                                                                                    "notification":{
                                                                                        "title":"Hello "+machi.name,
                                                                                        "body":suresult.name +" has just Accepted your Bookings for "+jingz_array.sessions.by,
                                                                                        "click_action":"com.techie_dany.srecshb.firenotify"
                                                                                    }
                                                                                },
                                                                                token : jingz_array.d_token
                                                                            }
                                                                            messaging.messaging().send(message)
                                                                            .then((result) => {
                                                                                console.log(result)
                                                                            }).catch((msgerr) => {
                                                                                console.log(msgerr)
                                                                            });
                                                                        }
                                                                    filterFine()
                                                                    .catch((e)=>{
                                                                        console.log(e)
                                                                        res.send("error at fine "+e)
                                                                    })
                                                                    startNotifyAdmin()
                                                                    .catch((notifierr)=>{
                                                                        console.log(notifierr)
                                                                        // res.send("error on messese sending to admin")
                                                                    })
                                                        }).catch((err) => {
                                                            
                                                        });
                                            //   res.send(machi)
                                        }).catch((err) => {
                                            console.log(err)
                                            res.send(err)
                                        });
                                    // res.send(adjees)
                                }).catch((aderr) => {
                                    console.log(aderr)
                                    res.send(aderr)
                                });
                
                    }).catch((err) => {
                        console.log("error while adding and removing from inbox and approved " +err)
                        res.send("error while adding and removing from inbox and approved")
                    });
        }).catch((err) => {
            console.log(err)
            res.send(err)
        });
        })
    
    
    app.post('/super_admin/cancel/session', function(req, res){
        mongoClient.superadmin_accounts.findOne({hall_id:req.body.hall_id,"inbox.date":req.body.date},{"inbox":1,"name":1})
        .then((suresult) => {
            //  console.log(result.inbox)
            var db_array = []
            var jingz_array = []
            // getting all db array and filtering for getting only out jingz array(approved)
            suresult.inbox.filter(function (val) { 
                if(val.sessions.session_id.toString() == req.body.session_id.toString() && val.date == req.body.date){
                    val.sessions.status = 1;
                    jingz_array = val
                }else {
                    db_array.push(val)
                }
            })
            //  Approving and removing =>approved and inbox-
                mongoClient.superadmin_accounts.findOneAndUpdate({hall_id:req.body.hall_id},{$set :{"inbox":db_array},$addToSet:{"rejected":jingz_array}})
                    .then((div) => {
                        // res.send("Approved and removed from superadmin inbox ")
                        //              removing from halls_details and admin pendings
                        // console.log(jingz_array)
                            mongoClient.admin_accounts.findOne({email:jingz_array.email,"pendings.date":req.body.date},{"pendings":1})
                                .then((adjees) => {
                                    // console.log(adjees)
                                    
                                        var ad_db_array = []
                                        adjees.pendings.filter(function (toast) {
                                            // console.log(toast)
                                            // console.log(toast.sessions.session_id)
                                            if(toast.sessions.session_id.toString()==req.body.session_id.toString() && toast.date == req.body.date){}
                                            else {
                                                ad_db_array.push(toast);
                                            }
                                        })

                                        console.log("ad_db_array--!@#$%^&*&^%$#@")
                                        console.log(ad_db_array)
                                        //   adding to booked and removing from pendings
                                        mongoClient.admin_accounts.findOneAndUpdate({email:jingz_array.email},{$set :{"pendings":ad_db_array},$addToSet:{"rejected":jingz_array}})
                                        .then((machi) => {
                                            console.log("machi+++++++++_+_+_+_+_+_+_+_")
                                            console.log(machi)

                                                    // setting status of hall_details status =1 #booked
                                                    mongoClient.hall_details.findOneAndUpdate({_id:req.body.hall_id,"bookings.date_container.date":req.body.date},{$unset:{"bookings.date_container.$":""}},
                                                    {projection:{"bookings.date_container.$":1}})
                                                        .then((rish) => {
                                                            console.log("rish )_)()(()(*()(*")
                                                            // console.log(rish)
                                                            console.log(rish.bookings.date_container[0])
                                                            
                                                            
                                                                    async function filterFine() { // array of objects 

                                                                    var advind =  await rish.bookings.date_container[0].sessions.map(function (aish) { 
                                                                        console.log("aish")
                                                                                console.log(aish.session_id.toString(),req.body.session_id.toString())
                                                                                console.log(aish.session_id.toString()==req.body.session_id.toString())
                                                                            if(aish.session_id.toString()==req.body.session_id.toString()){
                                                                                aish.status = 0; //booked
                                                                                delete aish._id
                                                                                console.log("yaaaaaaaaaaaaaaaaaaah ")
                                                                                return aish
                                                                            }else {
                                                                                delete aish._id
                                                                                return aish
                                                                            }
                                                                        })
                                                                        
                                                                        //  return advind;
                                                                        console.log("///////////////Async starting//////////// " + advind)
                                                                        // var temp_fine = {
                                                                        //     "sessions" : []
                                                                        // };
                                                                        // for(let cup=0;cup<advind.length;cup++){
                                                                    
                                                                        let  tempad =  {
                                                                            date : req.body.date,
                                                                            sessions : advind,
                                                                            }

                                    
                                                                        // }
                                                                        // res.send(tempad)
                                                                            console.log("tempad ")
                                                                            console.log(tempad)
                                                                        mongoClient.hall_details.findOneAndUpdate({_id:req.body.hall_id},{
                                                                            $addToSet :{"bookings.date_container":tempad}})
                                                                        .then((ac) => {
                                                                            console.log("all is fine----------")

                                                                           
                                                                            res.send(ac)
                                                                            //  return 1
                                                                        }).catch((tut) => {
                                                                            console.log(tut)
                                                                            console.log("tut")
                                                                            return "000"
                                                                        });
                                                                        // }
                                                                        }
                                                                        async function startNotifyAdmin() { 
                                                                            console.log("||||||||||||||  STARTING NOTIFY||||||||||")
                                                                            console.log(jingz_array.d_token)
                                                                            let message = {
                                                                                data : {
                                                                                    "title":"Hello "+machi.name,
                                                                                    "body":suresult.name +" Rejected your Bookings for "+jingz_array.sessions.by,
                                                                                    "code":"302",
                                                                                },
                                                                                "android" :{
                                                                                    "notification":{
                                                                                        "title":"Hello "+machi.name,
                                                                                        "body":suresult.name +" Rejected your Bookings for "+jingz_array.sessions.by,
                                                                                        "click_action":"com.techie_dany.srecshb.firenotify"
                                                                                    },
                                                                                  
                                                                                },
                                                                                token : jingz_array.d_token
                                                                            }
                                                                            messaging.messaging().send(message)
                                                                            .then((result) => {
                                                                                console.log(result)
                                                                            }).catch((msgerr) => {
                                                                                console.log(msgerr)
                                                                            });
                                                                        }
                                                                    filterFine()
                                                                    .catch((e)=>{
                                                                        console.log(e)
                                                                        res.send("error at fine "+e)
                                                                    })
                                                                    startNotifyAdmin()
                                                                    .catch((notifierr)=>{
                                                                        console.log(notifierr)
                                                                        // res.send("error on messese sending to admin")
                                                                    })
                                                        }).catch((err) => {
                                                                console.log("status of hall_details status " +err)
                                                              res.send("erro status of hall_details status")
                                                        });
                                        }).catch((err) => {
                                            console.log(err)
                                            res.send(err)
                                        });
                                    // res.send(adjees)
                                }).catch((aderr) => {
                                    console.log(aderr)
                                    res.send(aderr)
                                });
                
                    }).catch((err) => {
                        console.log("error while adding and removing from inbox and approved " +err)
                        res.send("error while adding and removing from inbox and approved")
                    });
        }).catch((err) => {
            console.log(err)
            res.send(err)
        });

    })

    
    
        module.exports = app;
            // {
            // "date":"",
            // "hall_id":101,
            // "sessions_id":[5,6]
            // }
    
        // const jsonInput = {
        //     "email" : req.body.email,
        //     "hall_id":req.body.hall_id,
        // "bookings" : {
        //         "date_container" : [{
        //             "date" : req.body.date,
        //             "sessions" : [{
        //                 "session_id" : req.body.session_id,
        //                 "status" : 1,
        //                 "book_desc" : req.body.book_desc,
        //                 "by" :req.body.by 	
        //             }],
        //         }]}
        // }
    
        // let date_cont =jsonInput.bookings.date_container[0];   // new date

        // let session_cont = jsonInput.bookings.date_container[0].sessions[0]
        // console.log(req.body.date)
        // console.log(req.body.hall_id)
        //     var ses_Array = [];
        //   for (let y=0;y<req.body.session_id.length;y++){
        //       ses_Array.push(req.body.session_id[y])
        //  }




    // mongoClient.superadmin_accounts.findOneAndUpdate({hall_id:req.body.hall_id,"inbox.date":req.body.date,"inbox.sessions.session_id":[req.body.session_id]},
    // {$set:{"desc":"jesus will help me"}})
    //  .then((output)=>{
    //      console.log(output)
    //     //  let inbox_data = output[0];
    //     //  if(output==null || output.length==0 || output==[]){
    //     //      res.send("No Inbox found")
    //     //  }
    //     //  else {
    //     //      console.log("output")
    //     //     console.log(inbox_data.d_token)
    //     //      mongoClient.superadmin_accounts.findOneAndUpdate({hall_id:req.body.hall_id,"inbox.date":req.body.date,"inbox.sessions.session_id":[req.body.session_id]},
    //     //      {$unset:{"inbox.$":""}})
    //     //      .then((result) => {
    //     //          console.log("result") // inbox cleared
    //     //          console.log(result)
    //     //              // adding session to approved
    //     //             //   mongoClient.superadmin_account.findOneAndUpdate({hall_id : req.body.hall_id},
    //     //             //      {$addToSet : {"approved":inbox_data}})
    //     //             //      .then((data)=>{
    //     //             //          console.log("data")

    //     //             //         //   removing from admin pending and adding to admin booked

    //     //             //         mongoClient.admin_account.findOneAndUpdate({email:inbox_data.email,"pending.date":req.body.date,"pendings.sessions.session_id":[req.body.session_id]}
    //     //             //     ,{$unset:{"pendings.$":""}})
    //     //             //         .then((result_admin1) => {
    //     //             //             console.log("result_admin")
    //     //             //             console.log(result_admin1)
    //     //             //             // adding to admin booked
    //     //             //             mongoClient.admin_account.findOneAndUpdate({email:inbox_data.email},{
    //     //             //                 $addToSet :{booked:inbox_data}
    //     //             //             })
    //     //             //             .then((result_admin2) => {
    //     //             //                 console.log("result_admin1")
    //     //             //                 console.log(result_admin1)

    //     //             //                 // setting booked (i.e) set status =1 in halls_details
    //     //             //                 // set at position null and append status with 1 
    //     //             //                 db.hall_details.findOneAndUpdate({_id:req.body.hall_id,"bookings.date_container.date":req.body.date,"bookings.date_container.sessions.session_id":req.body.session_id},{$unset:{"bookings.date_container.$":""}})
    //     //             //                 .then((result) => {
    //     //             //                     // adding new as a session status #1
    //     //             //                     console.log("++++++++++++ result "+result)
    //     //             //                     res.send(result)
                                        
    //     //             //                 }).catch((err) => {
    //     //             //                     console.log(" 1----- "+err)
    //     //             //                     res.send(err)
    //     //             //                 });
    //     //             //             }).catch((err) => {
    //     //             //                 console.log(" 2----- "+err)
    //     //             //                 res.send(err)
    //     //             //             });

    //     //             //         }).catch((err) => {
    //     //             //             console.log(" 2----- "+err)
    //     //             //             res.send(err)
    //     //             //         });

    //     //             //         //  res.send("added to Approved")
    //     //             //      }).catch((err)=>{
    //     //             //         console.log(" 3----- "+err)
    //     //             //          res.status(406).send("check correct2")
    //     //             //      })
                     
    //     //          }).catch((err)=>{
    //     //             console.log(" 4----- "+err)
                     
    //     //              res.send(err)
    //     //          })
    //     //  }
    //  })
    //  .catch((err)=>{
    //     console.log("5------ "+err)
    //      res.send(err)
    //  })

                        // // mongoClient.admin_account.findOneAndUpdate({email:jingz_array.email},{$addToSet:{"booked":jingz_array}})
                        //         .then((giv) => {
                        //             res.send("removed from admin pendings and added to booked") //removed from admin pendings and added to booked
                        //         }).catch((err) => {
                        //             console.log("Error on admin pendings removal "+err)
                        //             res.send(err)
                        //         });

   
