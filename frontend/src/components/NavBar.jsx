import  { useState } from "react";
import { Link } from "react-router-dom"; 
import '../styles.css';

const NavBar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>VideoStream</h2>
      </div>
      
      {/* Hamburger menu / Close button */}
      <div className={`navbar-toggle ${menuActive ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navbar links */}
      <ul className={`navbar-links ${menuActive ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuActive(false)}>Home</Link>
        </li>
        <li>
          <Link to="/VideoList" onClick={() => setMenuActive(false)}>About</Link>
        </li>
        <li>
          <Link to="/VideoUpload" onClick={() => setMenuActive(false)}>Upload</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
