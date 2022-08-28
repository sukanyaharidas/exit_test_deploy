const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path")
const cred= require ("./src/models/creds");
const jwt = require("jsonwebtoken");
const nodemailer=require("nodemailer")
// require("dotenv").config('.env');
const mongoose = require("mongoose")
const otpGenerator = require('otp-generator')
let currentUser='';

// const dotenv = require("dotenv");

const app = new express();
const port = 4400;

// dotenv.config();
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));


app.use(express.static('./dist/frontend'));

app.post('/api/senddata',(req, res)=>{
 console.log("email id is",req.body.data.mailid);
 currentUser=req.body.data.mailid;
var otpg=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
console.log("otp is",otpg)
data={
    mailid:req.body.data.mailid,
    _otp:otpg
}

// var _cred=new cred(data);
// _cred.save();


cred.findOneAndUpdate({mailid:currentUser},
    {$set:{
    mailid:currentUser,
    _otp:otpg}},
    function(err,doc){
            if(!doc){
             var _cred=new cred(data);
            _cred.save();
          
              res.send();
            }   } )


    var transporter = nodemailer.createTransport({
  
      service : "gmail",
      auth :{
        user:"testtmailforapp@gmail.com",
         pass:"vrvxhgqxqrtfxtfd"
      },
      tls : { rejectUnauthorized: false }
    });
  
    var mailOptions = {
        from: 'testtmailforapp@gmail.com',
        to:req.body.data.mailid ,
        // to: this.data.email,
        subject: 'OTP Generated',
        html: `<p>Hi, Please check the OTP generated for your authentication</p>
        <p>OTP:  ${otpg}</p>`
  
    };
  
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else {
            console.log('email send:'+info.response);
        }
    });
  
  });



  app.post('/api/sendotp', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method:GET,POST,PUT,DELETE");
    console.log("data is",req.body.data.otp);
 
   cred
    .findOne({mailid: currentUser, _otp: req.body.data.otp },(err,user)=>{
      if(!user){
        console.log("error is",err);
        res.status(401).send();
      }
      else{
        res.status(200).send();
      }
    })

  })


app.get('/*', function(req, res)  {
    res.sendFile(path.join(__dirname + '/dist//frontend/index.html'))
  });
  
  
  
  
  // port listening
  app.listen(port, function () {
      console.log('running on port 3000');
  })