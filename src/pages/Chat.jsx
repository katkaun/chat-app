import { useContext, useEffect, useState } from "react";
import styles from "../css/Chat.module.css";
import AuthContext from "../context/AuthProvider";
import Messages from "../comps/chat/Messages";
import MessageInput from "../comps/chat/MessageInput";
// import ChatPanel from "../comps/chat/ChatPanel";

const BASE_URL = import.meta.env.VITE_RAILWAY_URL;

const Chat = ({ existingConversationId }) => {
  const { auth } = useContext(AuthContext);
  const [conversationId, setConversationId] = useState(
    existingConversationId || crypto.randomUUID()
  );
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!conversationId) return; 
    console.log(`Fetching messages for conversationId: ${conversationId}`);

    try {
      const response = await fetch(
        `${BASE_URL}/messages?conversationId=${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data); 
      setMessages(data.messages || []); 
      console.log(messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId, auth.token]);

  const handleSendMessage = async (content) => {
    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          text: content,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const { latestMessage } = await response.json();
      console.log(latestMessage);
      setMessages((prevMessages) => [...prevMessages, latestMessage]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleDeleteMessage = async (msgID) => {
    try {
      const response = await fetch(`${BASE_URL}/messages/${msgID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.statusText}`);
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== msgID)
      );
    } catch (error) {
      console.error("Error deleting message:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWindow}>
        {/* <ChatPanel/> */}
        <div className={styles.chatInfo}>
          <span className="font-semibold">{auth.username}</span>
          <div className={styles.chatIcons}>
            <div className={styles.avatarContainer}>
              {auth.avatar && <img src={auth.avatar} alt="avatar" />}
            </div>
          </div>
        </div>

        <div className={styles.messages}>
          <Messages
            messages={messages}
            authUsername={auth.username}
            onDeleteMessage={handleDeleteMessage}
          />
        </div>

        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
