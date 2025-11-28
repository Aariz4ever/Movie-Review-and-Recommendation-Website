// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173" })); // Vite dev server

// // MongoDB connection
// mongoose.connect("mongodb://127.0.0.1:27017/moviereviews", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ Connected to MongoDB"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

// // Review Schema
// const reviewSchema = new mongoose.Schema({
//   movieId: String,
//   movieTitle: String,
//   rating: Number,
//   comment: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Review = mongoose.model("Review", reviewSchema);

// // POST: Add review
// app.post("/api/reviews", async (req, res) => {
//   try {
//     const review = new Review(req.body);
//     await review.save();
//     res.status(201).json(review);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET: reviews for a movie
// app.get("/api/reviews/:movieId", async (req, res) => {
//   try {
//     const reviews = await Review.find({ movieId: req.params.movieId });
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PUT: update review
// app.put("/api/reviews/:id", async (req, res) => {
//   try {
//     const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(review);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE review
// app.delete("/api/reviews/:id", async (req, res) => {
//   try {
//     await Review.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// app.listen(5000, () => console.log("✅ Server running on port 5000"));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moviereviews";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// Review schema (added user info)
const reviewSchema = new mongoose.Schema({
  movieId: String,
  movieTitle: String,
  rating: Number,
  comment: String,
  userId: String,      // store user id
  username: String,    // store username for display
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", reviewSchema);

// Helper: generate JWT
function createToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, username, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ---------- AUTH ROUTES ---------- */

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "username already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash });
    await user.save();

    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user (optional)
app.get("/auth/me", authMiddleware, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

/* ---------- REVIEW ROUTES (with auth checks) ---------- */

// POST: Add review (must be authenticated)
app.post("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const { movieId, movieTitle, rating, comment } = req.body;
    if (!movieId || !rating || !comment) return res.status(400).json({ error: "Missing fields" });

    const review = new Review({
      movieId,
      movieTitle,
      rating,
      comment,
      userId: req.user.id,
      username: req.user.username
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch reviews by movieId (public)
app.get("/api/reviews/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update review by ID (only owner)
app.put("/api/reviews/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Not found" });
    if (review.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete review by ID (only owner)
app.delete("/api/reviews/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Not found" });
    if (review.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

    await review.deleteOne();
    res.json({ message: "Review deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
