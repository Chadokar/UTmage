const { header, body } = require("express-validator");
const { verify } = require("../middlewares/verify");
const { validate } = require("../services/validator");
const {
  getChannel,
  updateChannel,
  getSubscribers,
  getVideos,
} = require("../controllers/channel");

const router = require("express").Router();

// get channel
router.get(
  "/",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verify,
  getChannel
);

// update channel
router.put(
  "/",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verify,
  updateChannel
);

// get subscribers count
router.get(
  "/subscribers",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verify,
  getSubscribers
);

// get youtube videos
router.get(
  "/videos",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verify,
  getVideos
);

module.exports = router;
