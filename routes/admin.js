const express = require("express");
const { body, header } = require("express-validator");
const { deleteUser, getAllUsers } = require("../controllers/admin");

const Router = express.Router();

// get all user
Router.get(
  "/users",

  //   [header("Authorization", "Authorization token is required").exists()],
  getAllUsers
);

// delete user
Router.delete(
  "/delete",

  //   [header("Authorization", "Authorization token is required").exists()],
  deleteUser
);

module.exports = Router;
