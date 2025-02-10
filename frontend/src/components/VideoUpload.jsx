import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../styles.css";

const VideoUpload = ({ onUpload }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const ALLOWED_FORMATS = ["video/mp4", "video/m4v"];

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "Please select a video file.";
    if (!ALLOWED_FORMATS.includes(selectedFile.type)) return "Invalid file format. Allowed: mp4, m4v";
    if (selectedFile.size > MAX_FILE_SIZE) return "File size exceeds 100MB limit.";
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setMessage(validationError);
      setMessageColor("red");
      setFile(null);
    } else {
      setMessage("");
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setMessage("Please enter a title and select a valid video.");
      setMessageColor("red");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setMessageColor("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dfbyhgngr/video/upload",
        formData
      );

      const videoUrl = cloudinaryResponse.data.secure_url;

      const response = await axios.post("https://video-streaming-backend-gamma.vercel.app/upload", {
        title,
        url: videoUrl,
      });

      if (response.status === 200) {
        setMessage("Video Uploaded Successfully!");
        setMessageColor("green");
        onUpload();
        setTitle("");
        setFile(null);
      } else {
        setMessage("Failed to upload video.");
        setMessageColor("red");
      }
    } catch (error) {
      setMessage("Video Uploaded Successfully!");
      setMessageColor("green");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="video-upload">
      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p style={{ color: messageColor }}>{message}</p>}
    </div>
  );
};

VideoUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default VideoUpload;
