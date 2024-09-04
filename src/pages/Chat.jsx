import styles from "../css/Chat.module.css";
import Messages from "../comps/chat/Messages";
import MessageInput from "../comps/chat/MessageInput";
import ChatPanel from "../comps/chat/ChatPanel";
import Conversations from "../comps/chat/Conversations";
import { ChatProvider } from "../context/ChatContext";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Chat = () => {
  const { auth } = useContext(AuthContext);

  return (
    <ChatProvider>
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
            <Messages />
          </div>
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;
