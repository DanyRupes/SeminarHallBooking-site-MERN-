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
            .catch(ee=>{console.log(ee)})
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
    try {
        const payload = ticket.getPayload();
        return payload;
    }
    catch(err){
        console.log(err)
        console.log("MyException..." +err)
        return "501";
    }
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

https.createServer(httpsOptions, app).listen(443, function(res){
    console.log('https://localhost')
})
// app.listen(8080,console.log('http://localhost:8080'))



// app.get('/verify/shb_user/:id', function(req, res){
     
//     // console.log(req.param('token_id'))  https://localhost/verify/shb_user?token_id=34653634573467
// //    console.log(req.param('id'))  https://localhost/verify/shb_user/34653634573467
//     // verifyAuth()
    
//     res.send("okay")    
    
// })


