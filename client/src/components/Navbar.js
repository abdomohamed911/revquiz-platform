import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <img
        src="/aiu-logo.png"
        alt="AIU Logo"
        className="navbar-logo"
        onClick={() => navigate('/')}
      />
      <span
        className="navbar-title clickable"
        onClick={() => navigate('/')}
      >
        ReviQuiz
      </span>
    </div>
  );
}

export default Navbar;
