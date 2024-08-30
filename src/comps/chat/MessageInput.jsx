import React, { useContext, useState } from "react";
import styles from "../../css/Chat.module.css";
import AuthContext from "../../context/AuthProvider";

const MessageInput = () => {
  const { auth, fetchMessages, BASE_URL } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState("");

    //Funktion för skicka
  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${auth.token}`,
        },

        body: JSON.stringify({
          text: newMessage,
          conversationId: "08af1102-9243-44c9-9020-9788cd84c7ff",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(data);
      setNewMessage(""); //Töm input
      fetchMessages(); //Hämta meddelanden på nytt efter skickat
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  //Hantera formulärsändning
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newMessage.trim() !== "") {
      handleSendMessage(newMessage);
    } else {
      alert("enter valid msg");
    }
  };

  return (
    <div className={styles.messageInput}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className={`input input-bordered flex-grow ${styles.input}`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary ml-2">Send</button>
      </form>
    </div>
  );
};

export default MessageInput;
