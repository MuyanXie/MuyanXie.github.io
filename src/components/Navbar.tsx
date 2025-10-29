import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/blogs">
            <h1>Sam's Space</h1>
          </Link>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item active">
            <Link to="/blogs">Blogs</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
