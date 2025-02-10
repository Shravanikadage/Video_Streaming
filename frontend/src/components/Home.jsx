// HomePage.jsx
import "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <h2>Welcome to VideoStream</h2>
      <p>Your go-to platform for streaming videos!</p>
      <div className="home-buttons">
        <Link to="/VideoUpload">
          <button className="home-button">Upload Video</button>
        </Link>
        <Link to="/VideoList">
          <button className="home-button">View Videos</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
