const { google } = require("googleapis");

const db = require("../db");

// OAuth2 client for Google APIs
const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const createVideo = async (req, res) => {
  try {
    const { title, description, url, last_update_by, yt_channel } = req.body;
    /**
     * title: string
     * description: string
     * url: string
     * last_update_by: number
     */
    // check if video exists
    const videoExists = await db("videos").where({ url }).first();
    if (videoExists) {
      res.status(400);
      throw new Error("This video already exists");
    }
    const video = await db("videos").insert({
      title,
      description,
      url,
      last_update_by,
      yt_channel,
    });

    res.status(201).json({ video, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

// update video details on youtube channel
const updateVideo = async (req, res) => {
  try {
    // get channel details from the database
    const channel = await db("channels")
      .select("*")
      .where({ id: req.user.yt_channel })
      .first();
    if (!channel) {
      throw new Error("Channel not found");
    }

    // set the credentials for the OAuth2 client
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    // update video details on youtube : description, title, defaultLanguage, liveBroadcastContent,localized ,publishedAt, tags, thumbnails etc
    const response = await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: req.query.id,
        snippet: {
          ...req.body,
        },
      },
    });

    // update the database with the new description
    await db("videos").where({ id: req.query.id }).update({
      description: req.body.description,
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  createVideo,
};
