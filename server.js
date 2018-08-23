var express = require('express')
var path = require('path')
var app = express()
var https = require('https')
var fs = require('fs')
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
    res.sendFile(__dirname,'/index.html')
})
console.log("oi")
app.get('/verify/shb_user/', function(req, res){
     

    console.log(req.param('token_id'))
    // verifyAuth(req.body.token_id)

    // verifyAuth(req.param.token_id)
    // .then((result)=>{
    //     // console.log(result)
    //     const domainName = result.hd;
    //     console.log(result)
        res.send("result")  
    // })
      
    
})

async function verifyAuth(token_id) { 
    const ticket = await client.verifyIdToken({
        idToken : token_id,
        audience : webclient2_ID
    })
    const payload = ticket.getPayload();
    // const user_id = payload['sub'];
    // const email = payload['email'];
    // const name = payload['name'];
    // const picture = payload['picture'];
    // const domain = payload['hd'];

    // console.log("user_id (sub)", user_id)
    // console.log("Email", email)
    // console.log("name", name)
    // console.log("Domain", domain)
    // console.log("picture", picture)
    // console.log("aud", payload['aud'])
    // console.log("email_verified", payload['email_verified'])

    return payload;

    // Filtering & responding based on Domain Name..
 }



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


