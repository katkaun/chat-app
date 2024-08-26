import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Login = () => {
  const { login } = useContext(AuthContext);
  const userRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      setIsLoading(false);
      setLoginMessage(`Welcome ${username}! Redirecting to chat...`);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/chat");
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="absolute top-20 left-0 right-0 text-center">
        <h1 className="text-4xl font-bold text-primary">Welcome to Chatify!</h1>
        <p className="text-lg">Sign in to connect with others</p>
      </div>

      <div
        className="max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col space-y-4 mt-6"
        data-theme="cupcake"
      >
        <h5 className="text-2xl font-semibold text-primary text-center">
          Sign In
        </h5>

        {errorMessage && (
          <p
            className="text-center text-base text-red-500"
            aria-live="assertive"
          >
            {errorMessage}
          </p>
        )}

        {loginMessage && (
          <p
            className="text-center text-base text-green-500"
            aria-live="polite"
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
            <button
              type="submit"
              className="btn btn-secondary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
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
