const {
  generateHash,
  generateJWT,
  handlebarsReplacements,
  parseToken,
} = require("../services/misc-services");
const { templateToHTML, sendMail } = require("../services/mail-services");
const bcrypt = require("bcryptjs");

const otp_generate = async (req, res) => {
  try {
    // get email
    const { email } = req.body;
    const payload = { email };

    //generating OTP
    let otp = Math.floor(100000 + Math.random() * 900000);

    // hashing OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await generateHash(otp, salt);
    payload.hashedOtp = hashedOtp;

    // generating content
    const replacements = { otp, expiresIn: "1 minutes" };
    const source = templateToHTML("templates/otp.html");
    const content = handlebarsReplacements({ source, replacements });

    // generating token ref
    const token = generateJWT(payload, { expiresIn: "1m" });

    // sending mail
    await sendMail({
      to: email,
      subject: "OTP verification | " + process.env.COMPANY,
      html: content,
    })
      .then(() => res.status(200).send({ message: "OTP is sent", token }))
      .catch((err) => {
        return res.status(424).send({ message: "OTP is not sent" });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

const otp_verify = async (req, res) => {
  try {
    // get otp
    const otp = parseInt(req.body.otp);

    // parse token
    const { email, hashedOtp } = parseToken(req);

    // compare otp
    const isMatch = compareHash(otp, hashedOtp);
    if (isMatch) {
      return res.status(200).send({ message: "OTP verified" });
    } else {
      return res.status(400).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  otp_generate,
  otp_verify,
};
