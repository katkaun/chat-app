import React, { useContext } from "react";
import styles from "../../css/Chat.module.css";
import { useChat } from "../../context/ChatContext";

const Conversations = () => {
  const { conversations, setSelectedConversation, receivedInvites } = useChat();

  return (
    <div>
      <h2 className={styles.userChat}></h2>
      <ul>
        {conversations.map((conversationId, index) => (
          <li
            key={`conversation-${conversationId}-${index}`}  
            className={styles.conversation}
            onClick={() => setSelectedConversation(conversationId)}
          >
            Conversation {index + 1}
          </li>
        ))}
        {receivedInvites.map((invite, idx) => (
          <li
            key={`invite-${invite.conversationId}-${idx}`}  
            className={styles.conversation}
            onClick={() => setSelectedConversation(invite.conversationId)}
          >
            {invite.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations;
