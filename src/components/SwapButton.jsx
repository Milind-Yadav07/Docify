import React from 'react';

// Button component to swap input and output languages and texts
const SwapButton = (props) => {
  const swapLanguages = props.swapLanguages;

  return (
    <div
      className="swap-position"
      onClick={swapLanguages} // Swap languages on click
      role="button"
      tabIndex="0"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          swapLanguages(); // Swap languages on Enter key press for accessibility
        }
      }}
    >
      <ion-icon name="swap-horizontal-outline"></ion-icon>
    </div>
  );
};

export default SwapButton;
