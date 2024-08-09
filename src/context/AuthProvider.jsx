import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

const BASE_URL = "https://chatify-api.up.railway.app";

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/csrf`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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

const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    console.log("Decoded JWT token:", decoded); // Log the entire decoded token
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT token:", error.message);
    return {};
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
    console.log("Full login response:", result); // Log the entire response object
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

    return token ? { token, userId, username, avatar, email } : {};
  });

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      // Fetch CSRF token
      const csrfToken = await fetchCsrfToken();
  
      // Log in and get token
      const result = await loginUser({ username, password, csrfToken });
      const { token } = result;
  
      // Decode JWT token to get user details
      const decodedToken = decodeJwtToken(token);
  
      // Use decoded token data
      const userId = decodedToken.id;
      const userName = decodedToken.user;
      const avatar = decodedToken.avatar;
      const email = decodedToken.email;
  
      // Handle user info
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", userName); 
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("email", email);
  
      setAuth({
        token,
        userId,
        username: userName,
        avatar,
        email,
      });
  
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
