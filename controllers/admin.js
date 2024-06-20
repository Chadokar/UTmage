const db = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select(
      "id",
      "first_name",
      "last_name",
      "email",
      "uuid",
      "username",
      "role",
      "profile_id",
      "yt_channel",
      "access_token",
      "refresh_token"
    );

    res.status(200).json({ users, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.sent({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("User id is required");

    // check if user exists
    const user = await db("users").where({ id }).first();
    if (!user) {
      res.status(404);
      throw new Error("This user does not exist");
    }

    // delete user
    await db("users").where({ id }).del();

    res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("User id is required");
    const { first_name, last_name, email, password } = req.body;

    // check if user exists
    const user = await db("users").where({ id }).first();
    if (!user) {
      res.status(404);
      throw new Error("This user does not exist");
    }

    // update user
    await db("users")
      .where({ id })
      .update({
        first_name,
        last_name,
        email,
        password,
      })
      .returning([
        "id",
        "first_name",
        "last_name",
        "email",
        "uuid",
        "password",
      ]);
    res
      .status(200)
      .json({ message: "User updated successfully", success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

// channel controller

// create channel

// get all channels

const getAllChannels = async (req, res) => {
  try {
    const channels = await db("channels").select(
      "id",
      "title",
      "description",
      "url",
      "yt_channel_id",
      "user_id"
    );

    res.status(200).json({ channels, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

// delete channel

const deleteChannel = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("Channel id is required");

    // check if channel exists
    const channel = await db("channels").where({ id }).first();
    if (!channel) {
      res.status(404);
      throw new Error("This channel does not exist");
    }

    // delete channel
    await db("channels").where({ id }).del();

    res
      .status(200)
      .json({ message: "Channel deleted successfully", success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

// delete video by id
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("Video id is required");

    // check if video exists
    const video = await db("videos").where({ id }).first();
    if (!video) {
      res.status(404);
      throw new Error("This video does not exist");
    }

    // delete video
    await db("videos").where({ id }).del();

    res
      .status(200)
      .json({ message: "Video deleted successfully", success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  deleteUser,
  getAllUsers,
  updateUser,
  deleteChannel,
  getAllChannels,
  deleteVideo,
};
