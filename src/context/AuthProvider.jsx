import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const avatar = localStorage.getItem("avatar");

    return token ? { token, userId, userName, avatar } : {};
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const avatar = localStorage.getItem("avatar");

    if (token) {
      setAuth({ token, userId, userName, avatar });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.id);
    localStorage.setItem("userName", data.username);
    localStorage.setItem("avatar", data.avatar);

    setAuth({
      token: data.token,
      userId: data.id,
      userName: data.username,
      avatar: data.avatar,
    });

    navigate("/chat");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("avatar");

    setAuth({});
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
