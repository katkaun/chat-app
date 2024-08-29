import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import ImgUploader from "./ImgUploader";

const ProfileForm = ({ onClose }) => {
  const { auth, updateUser } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState(auth.username || ""); // Initialize with auth values
  const [newEmail, setNewEmail] = useState(auth.email || ""); // Initialize with auth values
  const [newAvatar, setNewAvatar] = useState(auth.avatar || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    setNewUsername(auth.username || "");
    setNewEmail(auth.email || "");
    setNewAvatar(auth.avatar || "");
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowToast(false); 

    try {
      const updatedUser = {
        username: newUsername,
        email: newEmail,
        avatar: newAvatar,
      };

      await updateUser(updatedUser);
      setError("");
      setShowToast(true); // Show the toast message
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setError("Failed to update user details: " + error.message);
    }

    setLoading(false);
  };

  const handleUploadSuccess = (imageUrl) => {
    setNewAvatar(imageUrl);
  };

  console.log("Submitting user data:", {
    username: newUsername,
    email: newEmail,
    avatar: newAvatar
  });

  return (
    <div className="relative p-4">
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <div>
              <span>Profile updated successfully!</span>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <ImgUploader onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-200">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50"
            style={{ color: 'black', backgroundColor: 'white' }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50"
            style={{ color: 'black', backgroundColor: 'white' }}
          />
        </div>
        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
        <button
          type="submit"
          className="text-white text-xs py-2 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;