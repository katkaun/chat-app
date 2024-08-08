import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

const BASE_URL = "https://chatify-api.up.railway.app";

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/csrf`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch CSRF token";
      try {
        const data = await response.json();
        errorMessage = data.error || errorMessage;
      } catch (jsonError) {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("CSRF token fetched:", data.csrfToken);
    return data.csrfToken;
  } catch (error) {
    console.error("CSRF token fetch error:", error.message);
    throw error;
  }
};

const registerUser = async (payload) => {
  console.log("Registering user with payload:", payload);

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const loginUser = async (payload) => {
  console.log("Logging in with payload:", payload);

  try {
    const response = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Login failed");
    }

    const result = await response.json();
    console.log("User logged in successfully:", result);
    return result;
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");
    const email = localStorage.getItem("email");

    return token && userId ? { token, userId, username, avatar, email } : {};
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const avatar = localStorage.getItem("avatar");
      const email = localStorage.getItem("email");
      setAuth({ token, userId, username, avatar, email });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const csrfToken = await fetchCsrfToken(); // Fetch CSRF token here
      const result = await loginUser({ username, password, csrfToken });
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("username", result.username);
      localStorage.setItem("avatar", result.avatar);
      localStorage.setItem("email", result.email);

      setAuth(result);
      navigate("/chat");
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const result = await registerUser(payload);
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("username", result.username);
      localStorage.setItem("avatar", result.avatar);
      localStorage.setItem("email", result.email);

      setAuth(result);
      navigate("/chat");
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

  const updateAvatar = (newAvatar) => {
    localStorage.setItem("avatar", newAvatar);
    setAuth((prevAuth) => ({ ...prevAuth, avatar: newAvatar }));
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, register, logout, updateAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
