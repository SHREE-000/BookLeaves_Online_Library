const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { _router } = require("../../app");
const { response } = require("express");
const user_signup_helpers = require("../../helpers/user_signup");
require('dotenv').config()
const account_sid = process.env.ACCOUNT_SID_TWILIO
const service_sid = process.env.SERVICE_SID_TWILIO
const auth_token = process.env.AUTH_TOKEN_TWILIO
const client = require("twilio")(account_sid, auth_token);

router.use((req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
});

router.get("/", async (req, res) => {

	const user_partial = "User partial"

  let errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;

  res.render("user/signup", {
    errorMessage,
	user_partial,
    title: "Bookleaves-signup",
  });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  req.session.signUpData = req.body;

  req.session.user_number = req.body.user_number;
  try{
	req.session.otpType = 'signup'
	  client.verify
	  .services(service_sid)
	  .verifications.create({
		  to: `+91${req.session.user_number}`,
		  channel: "sms",
		})
		
		.then((response) => {
			
			if (response.status === "pending") {

				user_signup_helpers.doUserSignup (req.body).then ( (data) => {

					if (data.status) {
						req.session.successMessage = data.successMessage
						res.redirect("/u-otp" ,);
					}

					else {
						req.session.errorMessage = data.errorMessage
						res.redirect("/u-signup");
					}
				})
			}
				// res.redirect("/u-otp");
			// } else {
			// 	req.session.errorMessage = "Sending OTP Failed , Please Try Again Later";
			// 	req.session.errorMessage = response.errorMessage;
			// 	res.redirect("/u-signup");
			// }
		});
	}catch(error){
		console.log(error);
		res.redirect("/u-signup");
	}
});

module.exports = router;
