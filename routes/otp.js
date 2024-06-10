const { body, header } = require("express-validator");
const { validate } = require("../services/validator");
const { otp_generate, otp_verify } = require("../controllers/otp");
const { register } = require("../controllers/auth");

const Router = require("express").Router();

Router.post(
  "/generate",
  [
    body("email", "Email required").exists().isEmail(),
    body("first_name", "Name field is required").isString(),
    body("last_name", "Name field is required").isString(),
    body("password", "Password length should be atleast 8 characters").isLength(
      {
        min: 8,
      }
    ),
  ],
  validate,
  otp_generate
);

Router.post(
  "/verify",
  [
    body("otp", "OTP is required").exists().isNumeric(),
    header("Authorization", "Authorization token is required").exists(),
  ],
  validate,
  otp_verify,
  register
);

module.exports = Router;
