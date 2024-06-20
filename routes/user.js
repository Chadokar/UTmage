const express = require("express");
const { body, header } = require("express-validator");
const { validate } = require("../services/validator");
const { login } = require("../controllers/auth");
const refreshToken = require("../services/refresh-token");

const Router = express.Router();
// auth
Router.post(
  "/login",
  [
    body("email", "Email required").exists().isEmail(),
    body("password", "Password length should be atleast 8 characters").isLength(
      {
        min: 8,
      }
    ),
  ],
  validate,
  login,
  refreshToken
);

module.exports = Router;
