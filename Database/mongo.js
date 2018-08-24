var mongoose = require('mongoose')

// let url = "mongodb://localhost:27017/srec-shb";
// let url = "mongodb+srv://shbuser:srec26shbuser@srec-shb-cluster-0rwpz.mongodb.net/test?retryWrites=true";
let url = "mongodb://shbuser:LApewwuncadvof3@srec-shb-cluster-shard-00-00-0rwpz.mongodb.net:27017,srec-shb-cluster-shard-00-01-0rwpz.mongodb.net:27017,srec-shb-cluster-shard-00-02-0rwpz.mongodb.net:27017/srec_shb?ssl=true&replicaSet=srec-shb-cluster-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(url)//,{useNewUrlParser: true}

mongoose.connection.on('connected', ()=>{console.log("Db Connected "+ url)})
mongoose.connection.on('error',()=>{console.log("Error while connecting db "+url)}) 
// mongoose.connection.on('close',()=>{console.log("Db Closing "+url)}) 

var Schema = mongoose.Schema;

var accounts_schema = new Schema({
    name : String,
    email :String,
    role : String
})

var accounts_mode = mongoose.model("accounts", accounts_schema);
module.exports = {accounts : accounts_mode}