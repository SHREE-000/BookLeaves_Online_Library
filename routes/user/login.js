 const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { _router } = require("../../app");
const { response } = require("express");
const userOtpLoginHelper = require ('../../helpers/user_otpLogin')
const userLoginHelper = require ('../../helpers/user_login')
require('dotenv').config()
const account_sid = process.env.ACCOUNT_SID_TWILIO
const service_sid = process.env.SERVICE_SID_TWILIO
const auth_token = process.env.AUTH_TOKEN_TWILIO
const client = require("twilio")(account_sid, auth_token);

router.use ( (req, res, next) => {

    if (req.session.user) {
        console.log(req.session.user);
        res.redirect ('/')
    }
    else {
        next ()
    }
    
})

router.get('/' , (req , res) => {

    const user_partial = "User partial"

    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const user = req.session.user
    req.session.user = null
    const userLoggedIn = req.session.userLoggedIn
    req.session.userLoggedIn = null
    res.render ('user/login' , {title : 'Bookleaves-login' , user , errorMessage , userLoggedIn , user_partial})
})

router.post('/' , (req , res) => {

    userLoginHelper.doUserLogin(req.body).then ( (response) => {
        
        if (response.status) {
            req.session.user = response.user
            req.session.userLoggedIn = true
            res.redirect ('/')
        }

        else {
            req.session.errorMessage = response.errorMessage
            res.redirect ('/u-login')
        }
    })
    
})

router.post('/u-login-otp', async (req, res) => {

    userOtpLoginHelper.doOtpLogin (req.body).then ( (data) => {
        console.log(data.status , " status from login");
  
    req.session.user_number = req.body.user_number;
    if (data.status) {
        try{
        req.session.otpType = 'login'
        client.verify
        .services(service_sid)
        .verifications.create({
            to: `+91${req.session.user_number}`,
            channel: "sms",
          })
          
          .then((response) => {
              
              if (response.status === "pending") {
  
                      if (data.status) {
                          req.session.successMessage = data.successMessage
                          res.redirect("/u-otp");
                      }
  
                      else {
                          req.session.errorMessage = data.errorMessage
                          res.redirect("/u-login");
                      }
              }
                
          });
      }
    catch(error){
          console.log(error);
          res.redirect("/u-login");
      }
    }
    else {
        req.session.errorMessage = data.errorMessage
        res.redirect("/u-login");
    }
    })
  });


module.exports = router;