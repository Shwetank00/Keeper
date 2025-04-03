require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

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

//!create account
app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname) {
    return res.status(400).json({ error: "Fullname is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }

  const user = new User({
    fullname,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign(
    { user },
    process.env.ACCESS_TOKEN_SECRET || "defaultSecretKey",
    { expiresIn: "36000m" }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Account created successfully",
  });
});

//!login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.json({ error: true, message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ error: true, message: "Invalid password" });
  }

  const accessToken = jwt.sign(
    { user },
    process.env.ACCESS_TOKEN_SECRET || "defaultSecretKey",
    { expiresIn: "36000m" }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Login successful",
  });
});

app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
