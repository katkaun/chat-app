import { useContext, useState, useEffect } from "react";
import styles from "../../css/Chat.module.css";
import AuthContext from "../../context/AuthProvider";
import { generateGUID } from "../../utils/generateGUID";
import { useChat } from "../../context/ChatContext";

const InviteUser = () => {
    const { fetchAllUsers, users } = useChat();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [status, setStatus] = useState("");
    const {auth, BASE_URL} = useContext(AuthContext);
    const [conversationId, setConversationId] = useState(generateGUID());

    useEffect(() => {
      if (searchTerm.length > 0) {
        fetchAllUsers();
      } else {
        setSearchResults([]); 
      }
    }, [searchTerm, fetchAllUsers]);
  
    // Filtrera användare baserat på söktermen
    useEffect(() => {
      if (searchTerm.length > 0) {
        const results = users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]); // Rensa sökresultat om söktermen är tom
      }
    }, [searchTerm, users]);
  
    const handleInviteUser = async (userId) => {
      if (!userId) {
        setStatus("Invalid user ID");
        return;
      }
  
      try {
        const response = await fetch(
          `${BASE_URL}/invite/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ conversationId }),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to invite user: ${response.statusText}`);
        }
  
        const data = await response.json();
        setStatus(`User invited successfully: ${data.message}`);
      } catch (error) {
        console.error("Error inviting user:", error.message);
        setStatus(`Failed to invite user: ${error.message}`);
      }
    };
  
    return (
      <div>
        <input
          name="search"
          type="text"
          className="mb-4 text-black flex-grow"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {searchResults.map((user, idx) => (
            <li key={idx} className="flex justify-between items-center mb-2">
              <span>{user.username}</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleInviteUser(user.userId)}
              >
                Invite
              </button>
            </li>
          ))}
        </ul>
        {status && <p>{status}</p>}
      </div>
    );
  };
  
  export default InviteUser;