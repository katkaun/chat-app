import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import styles from "../../css/Chat.module.css";
import { useChat } from "../../context/ChatContext";

const Conversations = () => {
  const { combinedConversations, setSelectedConversation } = useChat();

  return (
    <div>
      <h2 className={styles.userChat}>Conversations</h2>
      <ul>
        {combinedConversations.map((conversationId, index) => (
          <li
            key={conversationId || index}
            className={styles.conversation}
            onClick={() => setSelectedConversation(conversationId)}
          >
            Conversation {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations;
