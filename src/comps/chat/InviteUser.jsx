import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import { generateGUID } from "../../utils/generateGUID";
import { useChat } from "../../context/ChatContext";

const InviteUser = () => {
  const { fetchAllUsers, users } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState("");
  const { auth, BASE_URL } = useContext(AuthContext);
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
      const response = await fetch(`${BASE_URL}/invite/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to invite user: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus(`User invited successfully: ${data.message}`);
    } catch (error) {
      // console.error("Error inviting user:", error.message);
      setStatus(`Failed to invite user: ${error.message}`);
    }
  };

  return (
    <div className="relative">
      <input
        name="search"
        type="text"
        className="input input-bordered input-sm w-full max-w-xs text-gray-600 mb-3"
        placeholder="Search by username.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="absolute top-full left-0 mt-1 w-full max-w-xs bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-auto">
        {searchResults.map((user, idx) => (
          <li key={idx} className={`flex justify-between items-center m-2`}>
            <span className="font-semibold text-black">{user.username}</span>
            <button
              className="btn btn-primary btn-xs"
              onClick={() => handleInviteUser(user.userId)}
            >
              Invite
            </button>
          </li>
        ))}
        {status && <p className="text-sm text-accent">{status}</p>}
      </ul>
    </div>
  );
};

export default InviteUser;
