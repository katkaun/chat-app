import styles from "../../css/Chat.module.css";
import Conversations from "./Conversations";
import InviteUser from "./InviteUser";

const ChatPanel = () => {
  return (
    <div className={styles.chatPanel}>
      <h3 className="text-white font-semibold text-lg mb-6">Conversations</h3>
      <InviteUser />
      <div className="mb-3 border-bottom">
        <Conversations />
      </div>
    </div>
  );
};

export default ChatPanel;
