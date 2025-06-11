import React from 'react';
import './ChatBubble.css';

function ChatBubble({ message, sender }) {
  return (
    <div className={`chat-bubble ${sender}`}>{message}</div>
  );
}

export default ChatBubble; 