import React from 'react';

// TextArea component with optional character count and max length limit
const TextArea = (props) => {
  const id = props.id;
  const value = props.value;
  const setValue = props.setValue;
  const placeholder = props.placeholder;
  const maxLength = props.maxLength;
  const disabled = props.disabled;
  const showCharCount = props.showCharCount;

  // Handle input change with max length validation
  const handleChange = (e) => {
    if (!maxLength || e.target.value.length <= maxLength) {
      setValue(e.target.value);
    }
  };

  return (
    <div className="text-area">
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        cols="30"
        rows="10"
      />
      {/*Show character count if enabled and maxLength is set */}
      {showCharCount && maxLength && (
        <div className="chars">
          <span id={id + '-chars'}>{value.length}</span> / {maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;
