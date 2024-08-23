import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

const BASE_URL = import.meta.env.VITE_RAILWAY_URL;

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/csrf`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch CSRF token: ${response.status} ${response.statusText}`;
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
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Token has expired");
      return null; // Return null or handle expired token
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT token:", error.message);
    return null;
  }
};

const fetchJwtToken = async (payload) => {

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
      const csrfToken = await fetchCsrfToken();

      const result = await fetchJwtToken({ username, password, csrfToken });
      const { token } = result;

      // Decode JWT token to get user details
      const decodedToken = decodeJwtToken(token);


      // Use decoded token data
      const userId = decodedToken.id;
      const userName = decodedToken.user;
      const avatar = decodedToken.avatar;
      const email = decodedToken.email;

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
      const csrfToken = await fetchCsrfToken();
      const result = await registerUser({ ...payload, csrfToken });

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

  // const updateAvatar = (newAvatar) => {
  //   localStorage.setItem("avatar", newAvatar);
  //   setAuth((prevAuth) => ({ ...prevAuth, avatar: newAvatar }));
  // };
  const updateUser = async (updatedUser) => {
    const { token, userId } = auth; // Ensure userId is available from the context
  
    if (!userId) {
      throw new Error("User ID is missing");
    }
  
    try {
      console.log("Updating user with payload:", { userId, updatedData: updatedUser }); // Add this line for debugging
  
      const response = await fetch(`${BASE_URL}/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updatedData: updatedUser }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Extract response text for debugging
        console.error("Failed to update user:", errorText); // Log the error
        throw new Error(`Failed to update user: ${errorText}`);
      }
  
      const updatedData = await response.json();
  
      localStorage.setItem("avatar", updatedData.avatar);
      localStorage.setItem("username", updatedData.username);
      localStorage.setItem("email", updatedData.email);
  
      setAuth((prevAuth) => ({
        ...prevAuth,
        avatar: updatedData.avatar,
        username: updatedData.username,
        email: updatedData.email,
      }));
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
