require("dotenv").config(); // Load environment variables from .env

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

const app = express();

// ✅ Use MONGO_URI from environment instead of hardcoded config.json
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ Missing MONGO_URI environment variable");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB Atlas");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Import models
const User = require("./models/user.model");
const Note = require("./models/note.model");

// Middlewares
app.use(express.json());

// ✅ Use CORS properly (allow your frontend URL in production)
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow non-browser requests (like Postman)
        origin.endsWith(".vercel.app") ||
        origin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Example root route
app.get("/", (req, res) => {
  res.json({ data: "Server is Running!!" });
});

// ✅ Read JWT secret from env
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
if (!accessTokenSecret) {
  console.error("❌ Missing ACCESS_TOKEN_SECRET environment variable");
  process.exit(1);
}

// ✅ Listen on port from env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

//! Create account + send OTP first
app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  try {
    // Send OTP
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your email",
      text: `Your OTP code is: ${otp}`,
    });
    console.log("Signup OTP sent:", otp);

    // Save user
    const user = new User({
      fullname,
      email,
      password,
      emailOtp: otp,
      otpExpires,
      emailVerified: false,
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
      message: "Account created. OTP sent to email",
    });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    return res
      .status(400)
      .json({ error: true, message: "Invalid or unreachable email address" });
  }
});

//!login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: true, message: "Invalid password" });
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

//!Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.status(401);
  }

  return res.json({
    user: {
      fullname: isUser.fullname,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdON,
    },
    message: "User fetched successfully",
  });
});

//!Add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags,
      userId: user._id,
    });

    await note.save();

    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "internal server error" });
  }
});

//!Edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (
    title === undefined &&
    content === undefined &&
    tags === undefined &&
    isPinned === undefined
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Edit note failed:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//!Get all notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//!Delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await note.deleteOne();

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//!Update isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//!Search notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
  const { searchQuery } = req.query;
  const { user } = req.user;

  if (!searchQuery) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const notes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ],
    });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//! update-profile
app.put("/update-profile", authenticateToken, async (req, res) => {
  const { fullname, email } = req.body;
  const { user } = req.user;

  if (!fullname && !email) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser)
      return res.status(404).json({ error: true, message: "User not found" });

    let otpSent = false;

    if (fullname) {
      existingUser.fullname = fullname.trim();
    }

    if (email && email.trim() !== existingUser.email) {
      // new email is different → start verification process
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.pendingEmail = email.trim();
      existingUser.emailOtp = otp;
      existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
      existingUser.emailVerified = false; // set false only now

      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email.trim(),
          subject: "Verify your new email",
          text: `Your OTP code is: ${otp}`,
        });
        otpSent = true;
        console.log("OTP sent to pending email:", otp);
      } catch (err) {
        console.error("Failed to send OTP:", err);
        return res.status(400).json({
          error: true,
          message: "Invalid or unreachable new email address",
        });
      }
    }

    await existingUser.save();

    return res.json({
      error: false,
      message: otpSent
        ? "OTP sent to new email"
        : "Profile updated successfully",
      otpSent,
    });
  } catch (err) {
    console.error("Update profile failed:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//! Verify OTP after signup
app.post("/verify-signup-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ error: true, message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    if (
      user.emailOtp === otp &&
      user.otpExpires &&
      user.otpExpires > new Date()
    ) {
      user.emailVerified = true;
      user.emailOtp = undefined;
      user.otpExpires = undefined;
      await user.save();

      return res.json({ error: false, message: "Email verified successfully" });
    } else {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("Verify signup OTP failed:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//! Verify OTP after changing email
app.post("/verify-change-email-otp", authenticateToken, async (req, res) => {
  const { otp } = req.body;
  const { user } = req.user;

  if (!otp) {
    return res.status(400).json({ error: true, message: "OTP is required" });
  }

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    if (
      existingUser.emailOtp === otp &&
      existingUser.otpExpires &&
      existingUser.otpExpires > new Date() &&
      existingUser.pendingEmail
    ) {
      existingUser.email = existingUser.pendingEmail;
      existingUser.pendingEmail = undefined;
      existingUser.emailOtp = undefined;
      existingUser.otpExpires = undefined;
      existingUser.emailVerified = true;

      await existingUser.save();
      return res.json({
        error: false,
        message: "New email verified and updated",
      });
    } else {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("Verify change email OTP failed:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//! Change password
app.put("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { user } = req.user;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: true, message: "Both fields are required" });
  }

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser)
      return res.status(404).json({ error: true, message: "User not found" });

    if (existingUser.password !== currentPassword) {
      return res
        .status(401)
        .json({ error: true, message: "Current password incorrect" });
    }

    existingUser.password = newPassword;
    await existingUser.save();

    return res.json({ error: false, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password failed:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//! Forgot password (send OTP)
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: true, message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: true, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOtp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset your password",
        text: `Your OTP code is: ${otp}`,
      });
      console.log("Forgot password OTP sent:", otp);

      await user.save();
      return res.json({ error: false, message: "OTP sent to your email" });
    } catch (err) {
      console.error("Failed to send OTP:", err);
      return res
        .status(400)
        .json({ error: true, message: "Invalid or unreachable email address" });
    }
  } catch (err) {
    console.error("Forgot password failed:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));

module.exports = app;
