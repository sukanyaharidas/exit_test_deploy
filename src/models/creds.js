const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const DB = "mongodb+srv://Resume_Builder:resume123@cluster0.uq5mq.mongodb.net/meanapp_test?retryWrites=true&w=majority";
mongoose.connect(DB,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
 console.log("Database Connection Successful")
}).catch((err)=>{
 console.log(err)
})

const credSchema=new Schema({
    mailid: String,
    _otp: String
});

var CredSchema=mongoose.model('creds',credSchema);
module.exports=CredSchema;