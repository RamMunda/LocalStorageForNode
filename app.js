const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const nodemailgun = require('nodemailer-mailgun-transport');
const app = express();
require('dotenv').config();
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect(process.env.mongodbURL,
{    
 useNewUrlParser: true,
 useUnifiedTopology: true })
.then(() => console.log("mongodb connected"))
.catch(err =>console.log("mongodb is not connected",err));

const Schema =  new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  username:String
 
})
const User = mongoose.model('User',Schema);
app.get('/',async(req,res)=>{
  res.send("Heroku Testing App......")
})
app.post('/',async(req,res)=>{
  const {name, email, password} = req.body;
  const user = new User({
    name,
    email,
    password
  })

  const mailgunAuth = {
    auth: {
      api_key: process.env.api_key,
      domain: process.env.domain
    }
  }
   
  const smtpTransport = nodemailer.createTransport(nodemailgun(mailgunAuth))
       
  const mailOptions = {
    from: "kram766@gmail.com",
    to: "vackyhacky@gmail.com",
    subject: "EMAIL VALIDATION",
    text:"dvvdvdv vdxvxv"
    }
   
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error)
    } else {
      console.log("Successfully sent email.")
    }
  })

  
  await user.save();
  res.send('submitted')
});

app.post('/login',async(req,res)=>{
const { email, password} = req.body;
const search = await User.findOne({email:email})
  let user = new User({
     email:search.email,
     password:search.password

  })
  jwt.sign({ user:user}, 'secretkey' ,(err,token)=>{
    res.header('x-Authorization',`bearer${token}`).send({token:token})
})

});

app.post('/token',verification, async(req,res)=>{
  console.log("hhhhhvh")
  jwt.verify(req.token, 'secretkey', (err, authdata)=>{
    if(err){
        res.status(403).send();
    }
    else{
        res.send({
            message:"post created",
            authdata
        })
    }
})
})

function verification(req,res,next){
  // get auth header value
  const bearerheader = req.body.headers['authorization'];
  // check if bearer is undefind

  if(typeof bearerheader !=='undefined'){

      //split at the space

      const bearer = bearerheader.split(' ');

      // Get token from array

      const bearerToken = bearer[1];

      // set the token

      req.token = bearerToken;
      console.log("jbhb",bearerToken)
      next();
  }
  else{
      return res.status(403).send();
  }
  next();
}
app.post('/to',async(req,res)=>{
  console.log(req.headers)
  console.log(req.header)
  console.log(req.body.headers)
})
const port = process.env.Port;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})