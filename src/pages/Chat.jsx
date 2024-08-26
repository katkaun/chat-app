import { useContext, useEffect, useState } from "react";
import styles from "../css/Chat.module.css";
import AuthContext from "../context/AuthProvider";
import Messages from "../comps/chat/Messages";
import MessageInput from "../comps/chat/MessageInput";
import ChatPanel from "../comps/chat/ChatPanel";

const Chat = () => {
  const { auth, fetchMessages } = useContext(AuthContext);

  useEffect(() => {
    fetchMessages();
  }, [auth.token]);

  return (
    <div className={styles.container}>
        <ChatPanel/>
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
  );
};

export default Chat;
