const db = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select(
      "id",
      "first_name",
      "last_name",
      "email",
      "uuid",
      "password"
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

module.exports = {
  deleteUser,
  getAllUsers,
};
