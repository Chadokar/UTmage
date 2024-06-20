const db = require("../db");
const bcrypt = require("bcryptjs");
const {
  generateHash,
  compareHash,
  generateJWT,
} = require("../services/misc-services");

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, username } = req.body;

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await generateHash(password, salt);

    const user = await db("users")
      .insert({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        username,
      })
      .returning(["id", "first_name", "last_name", "username", "email", "uuid"])
      .then((data) => data[0]);

    // console.log("user : ", user);

    // generate token
    const token = generateJWT({ id: user.id, email }, { expiresIn: "30d" });

    res.status(201).json({ user, token, success: true });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.detail, message: error.message, success: false });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db("users")
      .select(
        "id",
        "first_name",
        "last_name",
        "email",
        "password",
        "uuid",
        "username",
        "role",
        "profile_id",
        "yt_channel",
        "access_token",
        "refresh_token"
      )
      .where({ email })
      .first();

    // check if user exists
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // check if password is correct
    const isMatch = await compareHash(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    console.log("user : ", user);

    // generate token
    const token = generateJWT({ id: user.id, email }, { expiresIn: "30d" });

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res
      .status(400)
      .send({ error: error.detail || error.message, success: false });
  }
};

module.exports = { register, login };
