const db = require("../db");

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const user = await db("users")
      .insert({
        first_name,
        last_name,
        email,
        password,
      })
      .returning(["id", "first_name", "last_name", "email", "uuid"]);

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.detail });
  }
};

module.exports = register;
