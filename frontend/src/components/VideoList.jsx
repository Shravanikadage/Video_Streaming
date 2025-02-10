import { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get("https://video-streaming-backend-gamma.vercel.app/videos");
      setVideos(res.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`https://video-streaming-backend-gamma.vercel.app/videos/${id}`);
        fetchVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setNewTitle(video.title);
    setNewFile(null);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    let updatedUrl = editingVideo.url;

    try {
      if (newFile) {
        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("upload_preset", "ml_default");

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dfbyhgngr/video/upload",
          formData
        );

        updatedUrl = cloudinaryResponse.data.secure_url;
      }

      await axios.put(`https://video-streaming-backend-gamma.vercel.app/videos/${editingVideo._id}`, {
        title: newTitle,
        url: updatedUrl,
      });

      fetchVideos();
      setShowModal(false);
      window.alert("Video updated successfully!");
    } catch (error) {
      console.error("Error updating video:", error);
      window.alert("Failed to update video. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="video-list">
      <h1>Videos</h1>
      <div className="video-items-container">
        {videos.map((video) => (
          <div key={video._id} className="video-item">
            <h3>{video.title}</h3>
            <video key={video.url} width="100%" controls>
              <source src={video.url} type="video/mp4" />
            </video>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => handleEdit(video)}>Edit</button>
              <button onClick={() => handleDelete(video._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Video Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Video</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="edit-input"
            />
            <input type="file" accept="video/*" onChange={(e) => setNewFile(e.target.files[0])} />
            <div className="modal-buttons">
  <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
  <button className="save-btn" onClick={handleUpdate} disabled={isUpdating}>
    {isUpdating ? "Updating..." : "Save Changes"}
  </button>
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;
