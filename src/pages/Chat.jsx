import { useContext } from "react";
import styles from "../css/Chat.module.css";
import AuthContext from "../context/AuthProvider";
import Messages from "../comps/chat/Messages";
import MessageInput from "../comps/chat/MessageInput";
import ChatPanel from "../comps/chat/ChatPanel";

const Chat = () => {
  const { auth } = useContext(AuthContext);  
  const conversationId = "08af1102-9243-44c9-9020-9788cd84c7ff";  // Placeholder, should be dynamic

  if (!auth || !auth.token) {
    // Handle the case where auth is not available (e.g., redirect to login)
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <ChatPanel />
      <div className={styles.chatWindow}>
        <div className={styles.chatInfo}>
          <span className="font-semibold">{auth.username}</span>
          <div className={styles.chatIcons}>
            <div className={styles.avatarContainer}>
              {auth.avatar && <img src={auth.avatar} alt="avatar" />}
            </div>
          </div>
        </div>

        <div className={styles.messages}>
          <Messages conversationId={conversationId} />
        </div>

        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
};

export default Chat;