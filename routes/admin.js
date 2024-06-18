const express = require("express");
const { body, header } = require("express-validator");
const {
  deleteUser,
  getAllUsers,
  deleteChannel,
  getAllChannels,
} = require("../controllers/admin");

const Router = express.Router();

// get all user
Router.get(
  "/users",

  //   [header("Authorization", "Authorization token is required").exists()],
  getAllUsers
);

// delete user
Router.delete(
  "/user/delete",

  //   [header("Authorization", "Authorization token is required").exists()],
  deleteUser
);

// youtube channel routes

// get all channels
Router.get(
  "/channels",

  //   [header("Authorization", "Authorization token is required").exists()],
  getAllChannels
);

// delete channel
Router.delete(
  "/channel/delete",

  //   [header("Authorization", "Authorization token is required").exists()],
  deleteChannel
);

module.exports = Router;
