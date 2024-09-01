import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthProvider";

const ChatContext = createContext({});

const ChatProvider = ({ children }) => {
  const { auth, BASE_URL } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  // Hämta meddelanden
  const fetchMessages = async () => {
    if (!auth.token) return;

    try {
      console.log("Fetching messages with token:", auth.token);
      const response = await fetch(
        `${BASE_URL}/messages?conversationId=08af1102-9243-44c9-9020-9788cd84c7ff`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data);

      console.log("Fetched messages:", data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [auth.token]);

  //Update user

  return (
    <ChatContext.Provider
      value={{
        messages,
        fetchMessages,
        BASE_URL,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
export { ChatContext };
