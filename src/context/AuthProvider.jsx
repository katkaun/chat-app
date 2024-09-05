import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCsrfToken,
  registerUser,
  fetchJwtToken,
  decodeJwtToken,
} from "../utils/authUtils";

const BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");
    const email = localStorage.getItem("email");
    const invite = localStorage.getItem("invite");

    return token ? { token, userId, username, avatar, email, invite } : {};
  });

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const csrfToken = await fetchCsrfToken();
      const { token } = await fetchJwtToken({ username, password, csrfToken });
      const decodedToken = decodeJwtToken(token);

      const { id, user, avatar, email, invite } = decodedToken;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("username", user);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("email", email);
      localStorage.setItem("invite", invite);

      setAuth({ token, userId: id, username: user, avatar, email, invite });

      if (invite) 
      navigate("/chat");
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const csrfToken = await fetchCsrfToken();
      await registerUser({ ...payload, csrfToken });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuth({});
    navigate("/login");
  };

  const updateUser = async (updatedUser) => {
    const { token, userId } = auth;

    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      const response = await fetch(`${BASE_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updatedData: updatedUser }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      setAuth((prevAuth) => ({ ...prevAuth, ...updatedUser }));
      Object.keys(updatedUser).forEach((key) => {
        localStorage.setItem(key, updatedUser[key]);
      });
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const removeAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );

    if (!confirmed) return;

    const { token, userId } = auth;

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.clear();
      setAuth({});
      navigate("/login");
      console.log("Account deleted");
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        BASE_URL,
        auth,
        login,
        register,
        logout,
        updateUser,
        removeAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;