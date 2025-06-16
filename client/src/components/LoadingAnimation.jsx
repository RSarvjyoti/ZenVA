import React from 'react';
import '../styles/LoadingAnimation.css';

function LoadingAnimation() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Please wait...</p>
    </div>
  );
}

export default LoadingAnimation;
