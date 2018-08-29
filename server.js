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

app.use(express.static(path.join(__dirname,'/views')))
app.use(express.static(path.join(__dirname,'/verifications')))
app.get('/', function(req, res){
    console.log("oii")
    // res.sendFile(__dirname,'/index.html')
    res.send("hello Java")
})



app.post('/verify/shb_user/', function(req, res){
    //  console.log(req) 

    let token_id = req.body.token_id;
    verifyAuth(token_id)
    .then((token_detail)=>{
        console.log("token_detail")
        // danyrupes.1505026@srec.ac.in
        const domain = token_detail.hd;
        const email = token_detail.email;
        const name = token_detail.name;
        const pic = token_detail.picture;
        // console.log(domain+" "+email+" "+name+" "+pic)
        if(domain === "srec.ac.in"){
            // find what kind of user /superadmin--or--/admin---or---/staffs..

            mongoClient.accounts.findOne({email : email})
            .then((data, err)=>{
                if(err){console.log(err);res.status(406).send("Not Acceptable")}
                else{
                    if(data!=null){
                        let role = data.role;
                        console.log(role)
                        res.json({
                            email : email,
                            name : name,
                            role : role,
                        })
                    }
                    else {
                        res.json({
                            email : email,
                            name : name,
                            role : "stf_user",
                        })
                    }
                }
            })
            .catch(ee=>{
                console.log(ee)
                res.status(500).send("DB Error"+ee)
            })
        }
        else {
            res.status(406).send("Not Autherized url")
        }
      
    })
    .catch((err)=>{
        console.log("myException "+err)
        res.status(404).send("No Data Found ")
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


 app.post('/inlude/srec-shb-admins/', function(req, res){
    // console.log(req)
    let email = req.body.email;
    let name = req.body.name;
    let role = req.body.role;
    // console.log(email+name+role)
        new mongoClient.accounts({name : name,email : email, role : role}).save()
        .then((out)=>{
            console.log(out)
            res.status(201).send("Created")
        })
        .catch((err)=>{
            console.log(err)
            res.status(404).send("Bad Request")
        })
})

const httpsOptions = {
    ca : fs.readFileSync(path.join(__dirname, 'certificates/additional','single.crt')),
    cert : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','certificate.crt')),
    key : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','private.key')),
    // ca : fs.readFileSync(path.join(__dirname, 'certificates/not-ren','ca_bundle.crt')),
}
// i have no desire to own you, to claim you. i love you just as you are . free your own.git 


app.get('/shb/mainpage1/feed', function (req, res) { 
    mongoClient.mainpage1_feed.find(function (err, data) { 
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
    console.log(req.body.date)
    console.log(req.body.hall_id)
    mongoClient.hall_details.findOne({_id : req.body.hall_id,"bookings.date_container.date":req.body.date},{"bookings.date_container.sessions.$":1},function(err,data){
        if(err){
            console.log("err" +err)
            res.status(501).send("Not Implemented")  //internal  server error
        }else{
            if(data == null){
                res.status(901).send("No Data")   
            }else {
                console.log(data)
                res.status(302).send(data.bookings.date_container[0].sessions)  //found .. sending list of sessions
            }
        }
    })
 })


app.post('/users/hall/id/', function(req, res){
    mongoClient.hall_details.findOne({_id : req.body.hall_id}, function(err, data){
        if(err){
            console.log(err)
            res.status(203).send("Non-Authoritative Information")
        }
        else {
            console.log(data)
            data.bookings = ""   ///speedy
            res.send(data)
        }
    })
})



app.post('/admin/book_hall', function(req, res){
    let body = req.body;
  
    let date_cont = req.body.bookings.date_container[0];   // new date
    // let myDate= req.body.bookings.date_container[0].date;   // new date
    let session_cont = req.body.bookings.date_container[0].sessions[0]
 // new session

    // console.log(date_cont)
    console.log(date_cont.date)
    // console.log(body._id)

    // first finding date
    mongoClient.hall_details.findOne({_id : body._id,"bookings.date_container.date" :date_cont.date}, function (err, date_out) { 
        if(err) {console.log(err)
            res.status(404).send("Error While finding date")}
        else {
            // date is free
             if(date_out == null){
                    console.log("else if......")
                    console.log("date null.............. creating one")
                    mongoClient.hall_details.updateOne({_id : body._id,
                    },{$addToSet : {"bookings.date_container":date_cont}}, function(err, out){
                        if(err){console.log(err)
                            res.status(401).send("check correct1")
                        }
                        else {
                            console.log(out)
                            res.status(201).send("Success new date and data's inserted")  //added a date and session
                        }
                    })  
                }
            else {
                console.log("Date present ..Adding new session")
                console.log("session_cont "+session_cont)
                // adding to particular date and adding a session
                mongoClient.hall_details.updateOne({_id : body._id,  "bookings.date_container.date": date_cont.date},
                {$addToSet : {"bookings.date_container.$.sessions":session_cont}}, function(err, out){
                    if(err){
                        console.log(err)
                        res.status(406).send("check correct2")
                    }
                    else {
                        console.log(out)  //accepted
                        res.status(202).send("Success new session inserted")  //updated a day ...added new session
                    }
                })
            }
        }  
     }) 
}) //post


app.post('/departments/get_hall/', function (req, res) {
    console.log(req.body.hall_id)
    let hall_id = req.body.id
    mongoClient.departments.findById({id : hall_id})
    .then((data)=>{
        console.log(data)
        res.status(200).send("Nice")
    })
    .catch((err)=>{
        res.status(203).send("something wrong please wait")
        console.log(err)})
})




// Forrest Add Hall Details.......
app.post('/forrest/add_hall_detail', function(req, res){
    let body = req.body
    // console.log(body)
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
app.post('/forrest/home_page/1/', function (req, res) {
   new mongoClient.mainpage1_feed({name: req.body.name,title :req.body.title,_id : req.body.id}).save()
    .then((dat)=>{
        console.log(dat)
        res.status(202).send("Forrest Okay")
    }).catch((err)=>{
        console.log(err)
        res.send("okay added")
    })
  })


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


