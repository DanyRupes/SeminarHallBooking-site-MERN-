var express = require('express')
var path = require('path')
var app = express()
var https = require('https')
var fs = require('fs')
const mongoClient = require('./Database/mongo.js')

var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended : true}))
app.use(bodyparser.json())
const oAuth2Client = require('google-auth-library')


var webclient2_ID = "947725322714-j912qqg8gr5ft16gaof3713n7dfjonvo.apps.googleusercontent.com";
const client = new  oAuth2Client.OAuth2Client(webclient2_ID);

var admin = require('firebase-admin')
var serviceAccount = require("./Firebase/srec-shb-firebase-adminsdk-yww66-5b9c3dbc69.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srec-shb.firebaseio.com"
});
var firebase_msg = admin.messaging().app


app.use(express.static(path.join(__dirname,'/views')))
app.use(express.static(path.join(__dirname,'/verifications')))
app.get('/', function(req, res){
    console.log("oii")
    // res.sendFile(__dirname,'/index.html')
    res.send("hello Java")
})



app.post('/verify/shb_user/', function(req, res){
    //  console.log(req) 

    let auth_token = req.body.auth_token;
    let device_token = req.body.device_token;
    console.log(auth_token)
    console.log(device_token)
    verifyAuth(auth_token)
    .then((token_detail)=>{
        console.log("token_detail")
        // danyrupes.1505026@srec.ac.in
        const domain = token_detail.hd;
        const email = token_detail.email;
        const name = token_detail.name;
        const pic = token_detail.picture;
        console.log(domain+" "+email+" "+name+" "+pic)
        if(domain === "srec.ac.in"){
            console.log("SREC Domain")
            // find what kind of user /superadmin--or--/admin---or---/staffs..
            mongoClient.forrest_accounts.findOne({email : email})
            .then((data, err)=>{
                if(err){console.log(err)
                    res.status(406).send("Not Acceptable")}
                else{
                    if(data!=null){
                        // ?find admin or super admin   
                        let role = data.role;
                        if(role==1){   //super admin part
                            console.log("Super Admin")
                            new mongoClient.superadmin_account({
                                name : name,
                                email : email,
                                role : 1,
                                hall_id : data._id,
                                device_token : device_token,
                            }).save().then((fine)=>{
                                console.log(fine)
                                res.status(201).send(fine)
                            }).catch((e)=>{
                                console.log(e)
                                res.status(406).send("Not Accepted sp")
                            })
                        }
                        else { //admin part
                            console.log("Admin")
                            new mongoClient.admin_account({
                                name : name,
                                email : email,
                                role : 2,
                                device_token : device_token,
                            }).save().then((fine)=>{
                                console.log(fine)
                                res.status(201).send(fine)
                            }).catch((e)=>{
                                console.log(e)
                                res.status(406).send("Not Accepted ad")
                            })
                        }
                    }  
                }
            })
            .catch(ee=>{
                console.log(ee)
                res.status(500).send("DB Error"+ee)
            })
        }
        // then if No Email is stored in db based on that user..... he/she will be normal user ..can see role =0
        else {
            console.log("Not SREC Domain")
            let unKnown = {"statusCode":105}
            res.send(unKnown)
        }
    })
    .catch((err)=>{
        console.log("myException "+err)
        res.status(500).send("Error while verifying user")
    })    
})

async function verifyAuth(token_id) { 
    const ticket = await client.verifyIdToken({
        idToken : token_id,
        audience : webclient2_ID
    })
        const payload = ticket.getPayload();
        return payload;

        console.log(err)
        console.log("MyException..." +err)
    }



// i have no desire to own you, to claim you. i love you just as you are . free your own.git 


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



app.post('/admin/book_hall', function(req, res){
    // var final_Sess_id=[];
    // for(let i=0;i<req.body.session_id.length;i++){

    //    final_Sess_id.push(req.body.session_id[i]);
    // }
    // console.log("finalsession_id"+final_Sess_id)
  

// console.log(req.body.)
    const jsonInput = {
        "_id" : req.body._id,
        "email" : req.body.email,
    "bookings" : {
            "date_container" : [{
                "date" : req.body.date,
                "sessions" : [{
                    "session_id" : req.body.session_id,
                    "status" : req.body.status,
                    "book_desc" : req.body.book_desc,
                    "by" :req.body.by 	
                 }],
            }]}
     }

 
    let date_cont =jsonInput.bookings.date_container[0];   // new date

    let session_cont = jsonInput.bookings.date_container[0].sessions[0]
    let admin_email = req.body.email;
 // new session

    // console.log(date_cont)
    // // console.log(jsonInput.bookings.date_container.)
    // console.log(jsonInput._id)
    // console.log(date_cont.date)
    // console.log(admin_email)
    // console.log("finalsession_id"+req.body.session_id)
   
    // first finding date
    mongoClient.hall_details.findOne({_id :jsonInput._id,"bookings.date_container.date" :date_cont.date}, function (err, date_out) { 
        if(err) {console.log(err)
            res.status(404).send("Error While finding date")}
            
        else {
            // date is free
           var noti;
             if(date_out == null){
                    console.log("else if......")
                    console.log("date null.............. creating one")
                    mongoClient.hall_details.findOneAndUpdate({_id : jsonInput._id,
                    },{$addToSet : {"bookings.date_container":date_cont}}, function(err, out){
                        if(err){console.log(err)
                            res.status(401).send("check correct1")
                        }
                        else {
                            // console.log(out)
                            startNotifiy(out); /////////////////////////------------Notifiying process
                            //// messagessss-------
                            // res.status(201).send("Success new date and data's inserted")  //added a date and session
                        }
                    })  
                }
            else {
                console.log("Date present ..Adding new session")
                
                // adding to particular date and adding a session
                mongoClient.hall_details.findOneAndUpdate({_id : jsonInput._id,  "bookings.date_container.date": date_cont.date},
                {$addToSet : {"bookings.date_container.$.sessions":session_cont}}, function(err, out){
                    if(err){
                        console.log(err)
                        res.status(406).send("check correct2")
                    }
                    else {
                        startNotifiy(out); /////////////////////////------------Notifiying process
                            //// messagessss-------
                        // res.status(202).send("Success new session inserted")  //updated a day ...added new session
                    }
                })
            }
            function startNotifiy(out) { 
                // console.log(out)
                var super_email = [];
                var admin_device_token;
                
                console.log('///////---------------//////////')
                // console.log(session_cont)
                let pendings = {
                    date : date_cont.date,
                    session : session_cont
                }
                // add first to admin pending bucket
                mongoClient.admin_account.findOneAndUpdate({email : admin_email},{$addToSet : {pendings : pendings}
                },{projection:{device_token:1}})  //getting admin device token
                .then((data)=>{
                    // console.log(data)
                    console.log(data)
                    admin_device_token = data.device_token;
                    let inbox = {
                        date : date_cont.date,
                        sessions : session_cont,
                        email : admin_email,
                        d_token : admin_device_token,
                    }
                    //second  adding to super admin inbox .store admin email and device token
                        mongoClient.superadmin_account.findOneAndUpdate({hall_id:jsonInput._id},{
                            $addToSet : {inbox : inbox}}).then((fine)=>{
                            console.log("fine")
                            let head_name = fine.name;
                            // sending message notification to super admin device
                            let sa_inbox_msg = {
                                data : {
                                    hall : "booked",
                                    status : "okay",
                                },
                                "notification" : {
                                    "title" : "Hello "+head_name,
                                    "body" : session_cont.by+" has Requsted Your Seminar Hall on"+date_cont.date
                                },
                                token : fine.device_token
                            } 
                                    firebase_msg.messaging().send(sa_inbox_msg).then((nice)=>{
                                        console.log("all is good")
                                        res.send(nice)
                                    }).catch((err)=>{
                                        console.log(err)
                                        res.send("Success But Not Message Sent")
                                    })

                        }).catch((err)=>{
                            console.log(err)
                            res.send(err)
                        })
                })
                .catch((err)=>{
                    console.log(err)
                    res.send(err)
                })
             }
        }  
     }) 
}) //post




// Forrest Add Hall Details.......
app.post('/forrest/add_hall_detail', function(req, res){
    let body = req.body
    console.log(body)
    new mongoClient.hall_details({
        "_id" : body._id,
        name : body.name,
        head : body.head,
        prime : body.prime,
        seats : body.seats,
        ac : body.ac,
        projectors : body.projectors,
        bookings : req.body.bookings
    }).save()
    .then((data)=>{res.send(data)})
    .catch((err)=>{console.log(err)
    res.status(500).send("correction shld noted")})
})

// Forrest Srec-shb main page -- little infos : {Name, Hall Title, Pic}
app.post('/forrest/homepage/feed/add', function (req, res) {
   new mongoClient.shb_home_page({head: req.body.head,title :req.body.title,_id : req.body._id}).save()
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
    console.log(req.body._id)
    mongoClient.forrest_accounts({email : req.body.email, role :req.body.role,_id : req.body._id}).save()
    .then((out)=>{
        console.log(out)
        res.status(200).send(out)
    })
    .catch((e)=>{
        console.log(e)
        res.send("Wrong acc forrest")
    })
  })

//   temporary for forrest add fake admin account for Booking process
app.post('/forrest/dummy/include/admin_acc', function (req, res) {
    console.log("Admin")
    
    new mongoClient.admin_account({
        name : req.body.name,
        email : req.body.email,
        role : 1,
        device_token : req.body.device_token,
    }).save().then((fine)=>{
        console.log(fine)
        res.status(201).send("created admin")
    }).catch((e)=>{
        console.log(e)
        res.status(406).send("Not Accepted ad")
    })
  })

//   temporary for forrest add fake Super-admin account for Booking process
app.post('/forrest/dummy/include/super_admin_acc', function (req, res) {
    console.log("Admin")
    
    new mongoClient.superadmin_account({
        name : req.body.name,
        email : req.body.email,
        role : 1,
        hall_id : req.body._id,
        device_token : req.body.device_token,
    }).save().then((fine)=>{
        console.log(fine)
        res.status(201).send("created super admin")
    }).catch((e)=>{
        console.log(e)
        res.status(406).send("Not Accepted ad")
    })
  })


const httpsOptions = {
    ca : fs.readFileSync(path.join(__dirname, 'certificates/additional','single.crt')),
    cert : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','certificate.crt')),
    key : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','private.key')),
    // ca : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','ca_bundle.crt')),
}
// https.createServer(httpsOptions, app).listen(443, function(res){
//     console.log('https://localhost')
// })
app.listen(11000,console.log('http://localhost:11000'))



// app.get('/verify/shb_user/:id', function(req, res){
     
//     // console.log(req.param('token_id'))  https://localhost/verify/shb_user?token_id=34653634573467
// //    console.log(req.param('id'))  https://localhost/verify/shb_user/34653634573467
//     // verifyAuth()
    
//     res.send("okay")    
    
// })


