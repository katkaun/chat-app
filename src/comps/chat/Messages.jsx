import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import styles from "../../css/Chat.module.css";
import DeleteIcon from "../DeleteIcon";

const Messages = () => {
  const { auth, fetchMessages, messages, BASE_URL } = useContext(AuthContext);

  const deleteMessage = async (msgID) => {
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
      const data = await response.json();
      console.log(data);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error.message);
    }
  };
  console.log(messages);

  useEffect(() => {
    fetchMessages();
  }, [auth.token]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.userId === auth.userId ? (
            <div className="chat chat-end">
              <div className="chat-bubble bg-purple-500 text-white relative p-4">
                {message.text}
                <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
                  <span className="flex-shrink-0">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    className="ml-2 tooltip"
                    data-tip="Delete"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat chat-start">
              <div className="chat-bubble bg-purple-200 text-gray-800 relative p-4">
                {message.text}
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span className="flex-shrink-0">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
