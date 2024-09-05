import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthProvider";
import { decodeJwtToken } from "../utils/authUtils";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { auth, BASE_URL } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);

  useEffect(() => {
    if (auth.token) {
      const decodedToken = decodeJwtToken(auth.token);
      if (decodedToken?.invite) {
        console.log("Received invites:", decodedToken.invite);
        setReceivedInvites(JSON.parse(decodedToken.invite));
      } else {
        console.warn("No invites found in the token");
        setReceivedInvites([]);
      }
    }
  }, [auth.token]);

  const fetchSentInvitations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/conversations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch conversations: ${response.statusText}`
        );
      }

      const data = await response.json();
      setConversations(data);
      console.log("Sent invites (conversations):", data);
    } catch (error) {
      console.error("Error fetching conversations:", error.message);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchSentInvitations();
    }
  }, [auth.token]);

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `${BASE_URL}/messages?conversationId=${conversationId}`,
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
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const fetchMessagesWithUserId = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(`${BASE_URL}/messages?userId=${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
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

  const updateMessages = () => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        fetchSentInvitations,
        messages,
        selectedConversation,
        setSelectedConversation,
        updateMessages,
        loading,
        updateMessages,
        fetchAllUsers,
        fetchMessages,
        fetchMessagesWithUserId,
        users,
        conversations,
        setMessages,
        receivedInvites,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
export default ChatContext;
