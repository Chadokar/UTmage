// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtubepartner",
        "https://www.googleapis.com/auth/youtubepartner-channel-audit",
      ],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GoogleStrategy callback called");
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
        console.log("Profile:", profile);

        const user = { username: profile.displayName };
        done(null, user, { accessToken }, { refreshToken });
      } catch (error) {
        console.error("Error in GoogleStrategy callback: ", error);
        done(error);
      }
    }
  )
);
