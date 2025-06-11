import React, { useState, useEffect, useRef } from 'react';

// Dropdown component to select a language from a list
const Dropdown = (props) => {
  const { languages, selected, setSelected, id } = props;
  const [active, setActive] = useState(false); // Dropdown open/close state
  const dropdownRef = useRef(null); // Ref to detect clicks outside dropdown

  // Find the selected language object or default to first language
  const selectedLanguage = languages.find(lang => lang.code === selected) || languages[0];

  // Close dropdown if click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle selecting a language option
  const handleSelect = (code) => {
    setSelected(code);
    setActive(false);
  };

  return (
    <div
      className={active ? 'dropdown-container active' : 'dropdown-container'}
      id={id}
      ref={dropdownRef}
      onClick={() => setActive(!active)} // Toggle dropdown open/close
    >
      <div className="dropdown-toggle">
        <ion-icon name="globe-outline"></ion-icon>
        <span className="selected" data-value={selectedLanguage.code}>
          {selectedLanguage.name} ({selectedLanguage.native})
        </span>
        <ion-icon name="chevron-down-outline"></ion-icon>
      </div>
      <ul className="dropdown-menu">
        {languages.map(lang => (
          <li
            key={lang.code}
            className={lang.code === selected ? 'option active' : 'option'}
            data-value={lang.code}
            onClick={() => handleSelect(lang.code)} // Select language on click
          >
            {lang.name} ({lang.native})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
