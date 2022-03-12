const { response } = require('express')
const express = require ('express')
const router = express.Router()
const adminLogginHelpers = require ('../../helpers/admin_otpLogin')
const adLogginHelpers = require ('../../helpers/admin_login')
const cors = require("cors");
const bodyParser = require("body-parser");
const { _router } = require("../../app");


router.use ( (req, res, next) => {

    if (req.session.admin) {
        console.log(req.session.admin);
        res.redirect ('/a-home')
    }
    else {
        next ()
    }
    
})


router.get ('/', (req,res) => {

    console.log("hi");
    const admin = req.session.admin
    req.session.admin = null
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    res.render('admin/login', {admin , admin_partial : true , errorMessage})
    
})

router.post ('/', (req,res) => {
    
    
    adLogginHelpers.doAdminLogin(req.body).then ( (response) => {
        
        if (response.status) {
            console.log("success");
            req.session.admin = response.admin
            req.session.LoggedIn = true
            res.redirect ('/a-home')

        }

        else {
            console.log("error");
            req.session.errorMessage = response.errorMessage
            res.redirect('/a-login')
        }
    })
})

// router.post ('/a-admin-otp', (req ,res) => {
    
    
//     req.session.admin_number = req.admin_number

//     adminLogginHelpers.doAdminOtpLogin(req.body).then( (response) => {
//         console.log(response)


//         if (response.status) {
//             console.log(response.admin)
//             console.log("success")

//             try{
//                 client.verify
//                 .services(service_sid)
//                 .verifications.create({
//                     to: `+91${req.session.admin_number}`,
//                     channel: "sms",
//                   })
                  
//                   .then((response) => {
                      
//                       if (response.status === "pending") {
          
//                               if (data.status) {
//                                   req.session.successMessage = data.successMessage
//                                   res.redirect("/a-otp");
//                               }
          
//                               else {
//                                   req.session.errorMessage = data.errorMessage
//                                   res.redirect("/a-login");
//                               }
//                       }
                        
//                   });
//               }
//             catch(error){
//                   console.log(error);
//                   res.redirect("/a-login");
//               }

//         }

//         else {
//             req.session.errorMessage = data.errorMessage
//             res.redirect("/a-login");
//         }
//     })
// })



module.exports = router;