const Router = require("express").Router();

const { redirectedUrl, decoder } = require("../controllers/auth.google");

const router = Router;

// router.get("/google/auth", passport.authenticate("google"), (req, res) => {
//   console.log(req?.user || "no user");
//   res.status(200).send("You have been authenticated");
// });

router.get("/google/auth", redirectedUrl);
router.get("/google/token", decoder);

module.exports = router;
