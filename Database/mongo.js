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

var superadmin_accounts = new Schema({
    name : String,
    email :String,
    role : Number,
    desig :String,
    desc : String,
    hall_id : Number,
    device_token : String,
    inbox : [{
        date : String,
        sessions : {
            "session_id" : Object,
            "status" : Number,
            "book_desc" :String,
            "by" :String 	
         },
        email : String,
        d_token : String,
    }],
    approved :  [{
        date : String,
        sessions : {
            "session_id" : Object,
            "status" : Number,
            "book_desc" :String,
            "by" :String 	
         },
        email : String,
        d_token : String,
    }],
    rejected : [{
        date : String,
        sessions : {
            "session_id" : Object,
            "status" : Number,
            "book_desc" :String,
            "by" :String 	
         },
        email : String,
        d_token : String,
    }],
})
var admin_accounts = new Schema({
    name : String,
    email :String,
    role : Number,
    desig :String,
    desc : String,
    device_token : String,
    pendings :  Array,
    booked :  [{
        date : String,
        sessions : {
            "session_id" : [Number],
            "status" : Number,
            "book_desc" :String,
            "by" :String 	
         }
    }],
    rejected : [{
        date : String,
        sessions : {
            "session_id" : Object,
            "status" : Number,
            "book_desc" :String,
            "by" :String 	
         },
        email : String,
        d_token : String,
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
        date_container : Array
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


var superadmin_accounts = mongoose.model("superadmin_accounts", superadmin_accounts)
var admin_accounts = mongoose.model("admin_accounts", admin_accounts)
var shb_home_page = mongoose.model("shb_home_page", shb_home_page)
var hall_details = mongoose.model("hall_details", hall_details)
var forrest_accounts = mongoose.model("forrest_accounts", forrest_accounts)

// var mainpage1_feed = mongoose.model('mainpage1_feed', mainpage1_feed)
module.exports = {
    hall_details :hall_details, 
    admin_accounts : admin_accounts,
    shb_home_page : shb_home_page,
    superadmin_accounts : superadmin_accounts,
    forrest_accounts : forrest_accounts
}

