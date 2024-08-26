import styles from "../../css/Chat.module.css";
import Conversations from "./Conversations";

const ChatPanel = () => {


  return (
    <div className={styles.chatPanel}>
      <h3 className="text-white font-semibold text-lg mb-6">Conversations</h3>
      <Conversations />
    </div>
  );
};

export default ChatPanel;
