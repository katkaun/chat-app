import styles from "../../css/Chat.module.css";
import Conversations from "./Conversations";
import InviteUser from "./InviteUser";

const ChatPanel = () => {
  return (
    <div
      className={`${styles.customBackground} text-white p-4 h-full overflow-auto`}
    >
      {" "}
      <h3 className="text-lg font-semibold mb-6">Start Chatting</h3>
      <InviteUser />
      <Conversations />
    </div>
  );
};

export default ChatPanel;
