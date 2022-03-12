const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const { _router } = require("../../app");
const { response } = require("express");
const userOtpHelper = require("../../helpers/user_otp");
require('dotenv').config()
const account_sid = process.env.ACCOUNT_SID_TWILIO
const service_sid = process.env.SERVICE_SID_TWILIO
const auth_token = process.env.AUTH_TOKEN_TWILIO
const client = require("twilio")(account_sid, auth_token);

const userOtpLoginHelper = require("../../helpers/user_otpLogin");

router.use(
  cors({
    origin: "*",
  })
);

router.use(bodyParser.json());

router.get("/", (req, res) => {

  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;
  const successMessage = req.session.successMessage;
  req.successMessage = null;
  res.render("user/otp", { errorMessage, successMessage, user_partial : true });
});

router.post("/", (req, res) => {
  const user_otp = req.body.user_otp;

  try {
    client.verify
      .services(service_sid)
      .verificationChecks.create({
        to: `+91${req.session.user_number}`,
        code: user_otp,
      })
      .then((verification_check) => {
        if (verification_check.status === "approved") {
          if (req.session.otpType == "login") {
            userOtpLoginHelper
              .doOtpLogin({ user_number: req.session.user_number })
              .then((data) => {
                req.session.user = data.user;
                req.session.userLoggedIn = true;
                res.redirect("/");
              });
          } else {
            userOtpHelper.doUserOtp(req.session.signUpData).then((response) => {
              req.session.user = response.user;
              req.session.userLoggedIn = true;
              res.redirect("/");
            });
          }
        } else {
          if (req.session.otpType == "login") {
            req.session.errorMessage = "Invalid OTP";
            res.redirect("/u-otp");
          } else {
            req.session.errorMessage = "Invalid OTP";
            res.redirect("/u-otp");
          }
        }
      });
  } catch (err) {
    req.session.errorMessage = "Invalid OTP";
    res.redirect("/u-otp");
  }
});

// resend otp after the timer

router.post("/resendOtp", (req, res) => {
  try {
    req.session.otpType = "login";
    client.verify
      .services(service_sid)
      .verifications.create({
        to: `+91${req.session.user_number}`,
        channel: "sms",
      })
      .then((response) => {
        if (response.status === "pending") {
          res.send(true);
        }
      });
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});

module.exports = router;
