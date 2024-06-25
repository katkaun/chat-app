import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setLoginMessage("");
  }, [userName, password]);

   // Fetch CSRF token when the component mounts
   useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("https://chatify-api.up.railway.app/csrf", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        } else {
          console.error("Failed to fetch CSRF token:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []); 

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(userName, password);

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            password: password,
            csrfToken: csrfToken,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", userName);
        localStorage.setItem("avatar", data.avatar);

        setAuth({
            token: data.token,
            userId: data.id,
            userName: userName,
            avatar: data.avatar,
        })

        setLoginMessage(`Welcome ${userName}! Redirecting to chat...`);
        setLoggedIn(true);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else if (response.status === 401) {
        const errorData = await response.json();
        setLoginMessage(errorData.error || "Invalid username or password");
      } else if (response.status === 403) {
        setLoginMessage("Access forbidden. Please contact support.");
      } else {
        console.error("Error:", response.statusText);
        setLoginMessage("Failed to log in. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginMessage("Failed to log in due to a network error.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-[400px] p-6 bg-white shadow-md rounded-md flex flex-col justify-between">
        <h5 className="my-6 text-xl font-semibold text-black">Sign In</h5>
        {loginMessage && (
          <p
            ref={errRef}
            className="mb-4 text-red-600 text-center"
            aria-live="assertive"
          >
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
              onChange={handleUserNameChange}
              value={userName}
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
              className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <span className="text-slate-400 mr-2">Need an Account?</span>
          <a
            href="/register"
            className="underline text-indigo-600 hover:text-blue-500"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
