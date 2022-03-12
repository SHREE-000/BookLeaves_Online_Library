const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { _router } = require("../../app");
const { response } = require("express");
const userOtpHelper = require("../../helpers/user_otp");
const adminLoginHelper = require ('../../helpers/admin_otp')

router.use(
    cors({
      origin: "*",
    })
  );
  
  router.use(bodyParser.json());

router.get ('/',(req , res) => {
    res.render('admin/otp' , {admin_partial : true})
} )

router.post("/", (req, res) => {
    const admin_otp = req.body.admin_otp;
  
    try {
      client.verify
        .services(service_sid)
        .verificationChecks.create({
          to: `+91${req.session.user_number}`,
          code: admin_otp,
        })
        .then((verification_check) => {
          if (verification_check.status === "approved") {

            adminLoginHelper.doAdminOtp(req.body).then( (response) => {
                
                if (response.status) {
                    res.redirect('/a-home')
          }  
          
          else {
              res.redirect('/a-otp')
          }
                })
            }
              
            
    }) 
}
    catch (err) {
      req.session.errorMessage = "Invalid OTP";
      res.redirect("/a-otp");
    }
  });


 
  

module.exports = router