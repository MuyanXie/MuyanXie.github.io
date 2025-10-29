import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Sam's Space</h1>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item active">
            <a href="#blogs">Blogs</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
