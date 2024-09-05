import styles from "../../css/Chat.module.css";
import Conversations from "./Conversations";
import InviteUser from "./InviteUser";

const ChatPanel = () => {
  return (
    <div
      className={`${styles.customBackground} text-white p-4 h-full overflow-auto`}
    >
      {" "}
      <h3 className="text-lg font-semibold mb-6">Conversations</h3>
      <InviteUser />
      <div className="border-b border-gray-600 mb-3">
        <Conversations />
      </div>
    </div>
  );
};

export default ChatPanel;
