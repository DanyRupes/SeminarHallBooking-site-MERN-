const  express = require('express')
var app = express()
const mongoClient = require('../Database/mongo.js')

const oAuth2Client = require('google-auth-library')


var webclient2_ID = "947725322714-j912qqg8gr5ft16gaof3713n7dfjonvo.apps.googleusercontent.com";
const client = new  oAuth2Client.OAuth2Client(webclient2_ID);
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
                            mongoClient.superadmin_account.findOneAndUpdate({
                                name : name,
                                email : email,
                                role : 1,
                                hall_id : data.hall_id,
                            },{$set :{
                                device_token : device_token,
                            }},{upsert:true}).then((fine)=>{
                                console.log(fine)////if no valus in db it returns null and we should get updated document
                                if(fine==null){
                                    mongoClient.findOne({email:email}, function(err, data){
                                        if(err){
                                            console.log("err on creating super admin acc"+err)
                                            res.send(err)
                                        }
                                        else{
                                            console.log(data)
                                            res.send(data)
                                        }
                                    })
                                }else{
                                    console.log("some other values")
                                    res.send(fine)
                                }
                            }).catch((e)=>{
                                console.log(e)
                                res.status(406).send("Not Accepted sp")
                            })
                        }
                        else { //admin part
                            console.log("Admin")
                            mongoClient.admin_account.findOneAndUpdate({
                                name : name,
                                email : email,
                                role : 2,
                            },{
                                $set :{device_token : device_token,}
                            },{upsert:true}).then((fine)=>{
                                if(fine==null){
                                    mongoClient.admin_account.findOne({email:email}, function (err, data) {
                                        if(err){
                                            console.log("error in admin acc creation"+err)
                                            res.send(err)
                                        }else {
                                            res.status(201).send(data)
                                        }
                                      })
                                }
                                else {
                                    console.log("fine"+fine)
                                    res.send(fine)
                                }
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

module.exports = app