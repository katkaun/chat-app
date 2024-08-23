import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Login = () => {
  const { login } = useContext(AuthContext);
  const userRef = useRef();
  // const errRef = useRef(); //might want later for display

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setLoginMessage("");
  }, [username, password]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with username:", username);

    try {
      await login(username, password);
      setLoginMessage(`Welcome ${username}! Redirecting to chat...`);
      setTimeout(() => navigate("/chat"), 3000);
    } catch (error) {
      setLoginMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="absolute top-20 left-0 right-0 text-center">
        <h1 className="text-4xl font-bold text-primary">Welcome to Chatify!</h1>
        <p className="text-lg mt-2">Sign in to connect with others</p>
      </div>

      <div
        className="max-w-md p-7 bg-white shadow-lg rounded-lg flex flex-col space-y-4"
        data-theme="cupcake"
      >
        <h5 className="text-2xl font-semibold text-primary text-center">
          Sign In
        </h5>
        {loginMessage && (
          <p
            className="text-center text-base text-red-500"
            aria-live="assertive"
          >
            {loginMessage}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-base font-semibold text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              className="input input-bordered w-full"
              type="text"
              id="username"
              placeholder="Enter your username"
              ref={userRef}
              autoComplete="off"
              onChange={handleUsernameChange}
              value={username}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-base font-semibold text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              className="input input-bordered w-full"
              type="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="off"
              onChange={handlePasswordChange}
              value={password}
              required
            />
          </div>
          <div>
            <button type="submit" className="btn btn-secondary w-full">
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center">
          <span className="text-gray-500">Need an Account?</span>
          <a
            href="/register"
            className="text-secondary hover:text-secondary-focus ml-1"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
