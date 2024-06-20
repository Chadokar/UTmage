const db = require("../db");
const { client } = require("./misc-services");

// refreshToken function to refresh the access token
const refreshToken = async (req, res) => {
  try {
    const { refresh_token, id } = req.user;
    if (!refresh_token) {
      res.status(400).send({ error: "Refresh token not provided" });
      return;
    }

    // Use the OAuth2Client instance to get the token
    const { tokens } = await client.refreshToken(refresh_token);
    // console.log("token : ", tokens);
    const user = await db("users")
      .where({ id })
      .update({
        access_token: tokens.access_token,
      })
      .returning([
        "id",
        "email",
        "access_token",
        "refresh_token",
        "yt_channel",
        "profile_id",
        "role",
        "username",
      ]);

    res.status(200).send({ tokens, user, token: req.token, success: true });
  } catch (error) {
    if (error.code < 400) res.status(500);
    res.send({ error: error.message, success: false });
  }
};

module.exports = refreshToken;
