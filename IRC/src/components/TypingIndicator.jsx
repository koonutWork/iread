import React from 'react';
import './TypingIndicator.css';

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="typing-label">Bot กำลังพิมพ์...</span>
    </div>
  );
}

export default TypingIndicator; 