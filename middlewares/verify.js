const db = require("../db");
const { verifyJWT, parseToken } = require("../services/misc-services");

const verify = async (req, res, next) => {
  try {
    // check bearer token is present
    if (!req.headers.authorization.startsWith("Bearer")) {
      res.status(401);
      throw new Error("Invalid token");
    }

    const token = parseToken(req);

    console.log("token : ", token);

    // check if token is present
    if (!token) {
      res.status(401);
      throw new Error("Access denied. No token provided.");
    }

    // verify token
    const decoded = verifyJWT(token);

    // check if token expired
    if (!decoded) {
      res.status(401);
      throw new Error("Token expired");
    }

    const { id } = decoded;
    const user = await db("users").select("*").where({ id }).first();
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    req.user = user;

    next();
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized", success: false });
  }
  next();
};

module.exports = { verify, isAdmin };
