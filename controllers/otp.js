const {
  generateHash,
  generateJWT,
  handlebarsReplacements,
  parseToken,
  compareHash,
} = require("../services/misc-services");
const { templateToHTML, sendMail } = require("../services/mail-services");
const bcrypt = require("bcryptjs");
const db = require("../db");

const otp_generate = async (req, res) => {
  try {
    // get email
    const { email, first_name, last_name, password, username } = req.body;
    const payload = { email, first_name, last_name, password, username };

    // check if user exists of giver email or username
    let user = await db("users").where({ email }).first();

    if (user) {
      res.status(400);
      throw new Error("Email already exists");
    }

    user = await db("users").where({ username }).first();

    if (user) {
      res.status(400);
      throw new Error("Username already exists");
    }

    //generating OTP
    let otp = Math.floor(100000 + Math.random() * 900000);

    console.log("opt : ", otp);

    // hashing OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await generateHash(otp, salt);
    payload.hashedOtp = hashedOtp;

    // generating content
    const replacements = { otp, expiresIn: "1 minutes" };
    const source = templateToHTML("templates/otp.html");
    const content = handlebarsReplacements({ source, replacements });

    // generating token ref
    const token = generateJWT(payload, { expiresIn: "3m" });

    // sending mail
    await sendMail({
      to: email,
      subject: "OTP verification | " + process.env.COMPANY,
      html: content,
    })
      .then(() =>
        res.status(200).send({ message: "OTP is sent", token, success: true })
      )
      .catch((err) => {
        return res
          .status(424)
          .send({ message: err.message || "OTP is not sent", success: false });
      });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const otp_verify = async (req, res, next) => {
  try {
    // get otp
    const otp = parseInt(req.body.otp);

    // parse token
    const { email, hashedOtp, first_name, last_name, password, username } =
      parseToken(req);
    req.body = { email, first_name, last_name, password, username };

    if (!email || !hashedOtp) {
      res.status(498);
      throw new Error("OTP has expired");
    }

    // compare otp
    const isMatch = await compareHash(otp, hashedOtp);

    // generate token
    if (isMatch) {
      const token = generateJWT(
        { email, first_name, last_name, password, username },
        { expiresIn: "30d" }
      );
      req.body.token = token;
    }

    // if otp is not matched
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid OTP");
    }
    next();
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  otp_generate,
  otp_verify,
};
