import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import styles from "../../css/Chat.module.css";
import DeleteIcon from "../DeleteIcon";
import { useChat } from "../../context/ChatContext";

const Messages = () => {
  const { selectedConversation, messages, updateMessages, deleteMessage } =
    useChat();
  const { auth, BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    if (selectedConversation) {
      updateMessages();
    }
  }, [selectedConversation, auth.token]);


  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length > 0 ? (
        messages.map((message) => {
          console.log("Message User ID:", message.userId);
          console.log("Authenticated User ID:", auth.userId);

          return (
            <div key={message.id}>
              {message.userId == auth.userId ? (
                <div className="chat chat-end">
                  <div className="chat-bubble">
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
                  <div className="chat-bubble bg-purple-200 text-gray-800 p-4">
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
          );
        })
      ) : (
        <p>No messages available</p>
      )}
    </div>
  );
};

export default Messages;
