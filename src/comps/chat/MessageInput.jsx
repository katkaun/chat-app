import React, { useState } from "react";
import styles from "../../css/Chat.module.css";

const MessageInput = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className={styles.messageInput}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className={`input input-bordered flex-grow ${styles.input}`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary ml-2">Send</button>
      </form>
    </div>
  );
};

export default MessageInput;