import "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoUpload from "./components/VideoUpload";
import VideoList from "./components/VideoList";
import NavBar from "./components/NavBar";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/VideoUpload" element={<VideoUpload />} />
          <Route path="/VideoList" element={<VideoList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
