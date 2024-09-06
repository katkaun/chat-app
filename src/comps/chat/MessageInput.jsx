import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { useChat } from "../../context/ChatContext";

const MessageInput = () => {
  const { auth, BASE_URL } = useContext(AuthContext);
  const { selectedConversation, fetchMessages } = useChat();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${auth.token}`,
        },

        body: JSON.stringify({
          text: newMessage,
          conversationId: selectedConversation,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(data);
      setNewMessage("");
      fetchMessages(selectedConversation);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="bg-gray-200 border-t border-gray-300 p-2">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered flex-grow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ml-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
