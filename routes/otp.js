const { body, header } = require("express-validator");
const { validate } = require("../services/validator");
const { otp_generate, otp_verify } = require("../controllers/otp");

const Router = require("express").Router();

Router.post("/generate", [
  [body("email", "Email required").exists().isEmail()],
  validate,
  otp_generate,
]);

Router.post("/verify", [
  [
    body("otp", "OTP is required").exists().isNumeric(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  otp_verify,
]);

module.exports = Router;
