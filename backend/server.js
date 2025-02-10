import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// CORS for Frontend
app.use(cors({
    origin: ["https://video-stream-frontend-one.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Video Schema & Model
const videoSchema = new mongoose.Schema({
  url: String,
  title: String,
});
const Video = mongoose.model("Video", videoSchema);

// Upload Video (Store URL Only)
app.post("/upload", async (req, res) => {
  const { title, url } = req.body;
  if (!url || !title) {
    return res.status(400).json({ message: "Missing video URL or title." });
  }

  const newVideo = new Video({ title, url });
  await newVideo.save();
  res.json({ message: "Video stored successfully!", video: newVideo });
});

// Fetch Videos
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos." });
  }
});

// Update Video (Edit Title & Video URL)
app.put("/videos/:id", async (req, res) => {
  const { title, url } = req.body;

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { title, url },
      { new: true } // Returns the updated document
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ message: "Video updated successfully!", video: updatedVideo });
  } catch (error) {
    res.status(500).json({ message: "Error updating video." });
  }
});


// Delete Video
app.delete("/videos/:id", async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    if (!deletedVideo) return res.status(404).json({ message: "Video not found." });

    res.json({ message: "Video deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video." });
  }
});


// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));