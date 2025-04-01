require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const accessToken = process.env.ACCESS_TOKEN;

app.get("/", (req, res) => {
  res.json({ data: "Hello World!", token: accessToken });
});

app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
