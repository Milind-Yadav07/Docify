import React from 'react';

// Toggle switch component for dark mode on/off
const ModeToggle = (props) => {
  const darkMode = props.darkMode;
  const setDarkMode = props.setDarkMode;

  return (
    <label className="toggle" htmlFor="dark-mode-btn">
      <div className="toggle-track">
        <input
          type="checkbox"
          className="toggle-checkbox"
          id="dark-mode-btn"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)} // Toggle dark mode state
        />
        <span className="toggle-thumb"></span>
        <img src="/sun.png" alt="Sun" />
        <img src="/moon.png" alt="Moon" />
      </div>
    </label>
  );
};

export default ModeToggle;
