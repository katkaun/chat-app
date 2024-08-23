import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const Messages = ({ messages = [] }) => {
  const { auth, deleteMessage } = useContext(AuthContext);

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat ${
            message.userId === auth.userId ? "chat-start" : "chat-end"
          }`}
        >
          <div
            className={`chat-bubble ${
              message.userId === auth.userId
                ? "bg-purple-200 text-gray-800"
                : "bg-purple-500 text-white"
            }`}
          >
            {message.text}
            {message.userId === auth.userId && (
              <button
                className="btn btn-danger ml-2"
                onClick={() => deleteMessage(message.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
