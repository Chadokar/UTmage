const express = require("express");
const register = require("../controllers/register");
const { body, header } = require("express-validator");
const { validate } = require("../services/validator");

const Router = express.Router();
// auth
Router.post(
  "/register",
  [
    body("first_name", "Name field is required").isString(),
    body("last_name", "Name field is required").isString(),
    body("password", "Password length should be atleast 8 characters").isLength(
      {
        min: 8,
      }
    ),
    header("Authorization", "Token is required").exists(),
  ],
  validate,
  register
);

module.exports = Router;
