import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Login = () => {
  const { login } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

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
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-[400px] p-6 bg-white shadow-md rounded-md flex flex-col justify-between">
        <h5 className="my-6 text-xl font-semibold text-black">Sign In</h5>
        {loginMessage && (
          <p className="mb-4 text-indigo-600 text-center" aria-live="assertive">
            {loginMessage}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="text-base font-semibold text-black"
            >
              Username:
            </label>
            <input
              className="w-full mt-3 py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600"
              type="text"
              id="username"
              placeholder="username"
              ref={userRef}
              autoComplete="off"
              onChange={handleUsernameChange}
              value={username}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="text-base font-semibold text-black"
            >
              Password:
            </label>
            <input
              className="w-full mt-3 py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600"
              type="password"
              id="password"
              placeholder="password"
              autoComplete="off"
              onChange={handlePasswordChange}
              value={password}
              required
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-800 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <span className="text-slate-400 mr-2">Need an Account?</span>
          <a
            href="/register"
            className="underline text-indigo-600 hover:text-indigo-800"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
