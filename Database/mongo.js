var mongoose = require('mongoose')

// let url = "mongodb://localhost:27017/srec-shb";
    // let url = "mongodb://localhost:27017";
    let url = "mongodb://localhost:27017/srec-shb";
// let url = "mongodb+srv://shbuser:srec26shbuser@srec-shb-cluster-0rwpz.mongodb.net/test?retryWrites=true";
// let url = "mongodb+srv://danyrupes:ForrestGump@srec-shb-cluster-0rwpz.mongodb.net";
// let url = "mongodb://test_admin:gumpy@srec-shb-cluster-shard-00-00-0rwpz.mongodb.net:27017,srec-shb-cluster-shard-00-01-0rwpz.mongodb.net:27017,srec-shb-cluster-shard-00-02-0rwpz.mongodb.net:27017/srec_shb?ssl=true&replicaSet=srec-shb-cluster-shard-0&authSource=admin&retryWrites=true";
// let url = "mongodb://shbuser:LApewwuncadvof3@srec-shb-cluster-shard-00-00-0rwpz.mongodb.net:27017,srec-shb-cluster-shard-00-01-0rwpz.mongodb.net:27017,srec-shb-cluster-shard-00-02-0rwpz.mongodb.net:27017/srec_shb?ssl=true&replicaSet=srec-shb-cluster-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(url)//,{useNewUrlParser: true}

mongoose.connection.on('connected', ()=>{console.log("Db Connected "+ url)})
mongoose.connection.on('error',()=>{console.log("Error while connecting db "+url)}) 
// mongoose.connection.on('close',()=>{console.log("Db Closing "+url)}) 

var Schema = mongoose.Schema;

var superadmin_account = new Schema({
    name : String,
    email :String,
    role : Number,
    desig :String,
    desc : String,
    hall_id : Number,
    device_token : String,
    inbox : [{
        date : String,
        sessions : Object,
        email : String,
        d_token : String,
    }],
    approved :  [{
        spA_id : Number,
        date : String,
        sessions : Object
    }],
    pendings :  [{
        spP_id : Number,
        date : String,
        sessions : Object,
    }],
    booked :  [{
        apB_id : Number,
        date : String,
        sessions : Object
    }],

})
var admin_account = new Schema({
    name : String,
    email :String,
    role : Number,
    desig :String,
    desc : String,
    device_token : String,
    pendings :  [{
        date : String,
        session : Object,
    }],
    booked :  [{
        date : String,
        sessions : Object
    }],
})


var hall_details = new Schema({
    _id : Number,
    name :String,
    head : Array,
    prime :Array,
    seats  :String,
    pics : [String],
    ac : String,
    projectors : String,
    bookings : {
        date_container : [{
            date : String,
            sessions : Array
        }]
    },
})

var shb_home_page = new Schema({
    _id : String,
    head : String,
    pic : String,
    title : String
})

var forrest_accounts = new Schema({
    email : String,
    role : Number,
    hall_id : Number
})


var superadmin_account = mongoose.model("superadmin_account", superadmin_account)
var admin_account = mongoose.model("admin_account", admin_account)
var shb_home_page = mongoose.model("shb_home_page", shb_home_page)
var hall_details = mongoose.model("hall_details", hall_details)
var forrest_accounts = mongoose.model("forrest_accounts", forrest_accounts)

// var mainpage1_feed = mongoose.model('mainpage1_feed', mainpage1_feed)
module.exports = {
    hall_details :hall_details, 
    admin_account : admin_account,
    shb_home_page : shb_home_page,
    superadmin_account : superadmin_account,
    forrest_accounts : forrest_accounts
}

