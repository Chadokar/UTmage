// config
// import "./config/config";

// imports
require("./config/config");
const express = require("express");
const cors = require("cors");

// initialize app
const app = express();
app.use(express.json());

// set up cors
app.use(cors());

// set up routes
const routes = require("./routes");

app.get("/", (req, res) => {
  res.status(201).json("status: success");
});
for (let prefix in routes) {
  app.use(`/${prefix}`, routes[prefix]);
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
