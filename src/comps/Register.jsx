import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    avatar: "",
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error("Failed to fetch CSRF token:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // CSRF token included in request payload
    setIsLoading(true);
    const payload = {
      ...userData,
      csrfToken,
    };

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      setIsLoading(false); // Reset loading state

      if (response.ok) {
        // Clear input fields
        setUserData({
          username: "",
          password: "",
          email: "",
        });
        setRegMessage("Account created! Redirecting to sign-in...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        if (response.status === 400) {
          const errorMessage = data.error || "Username or email already exists";
          setRegMessage(errorMessage);
        } else {
          setRegMessage(`Registration failed: ${data.message}`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Network error:", error);
      setRegMessage(
        "Registration failed due to a network error. Please try again later."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-[400px] p-6 bg-white shadow-md rounded-md flex flex-col justify-between">
        <h5 className="my-6 text-xl font-semibold text-black">Signup</h5>
        {regMessage && (
          <p
            className={`mb-4 ${
              regMessage.includes("created") ? "text-green-500" : "text-red-500"
            }`}
          >
            {regMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
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
              name="username"
              placeholder="Choose a unique username"
              value={userData.username}
              onChange={handleChange}
              required
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="text-base font-semibold text-black"
            >
              Password
            </label>
            <input
              className="w-full mt-3 py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600"
              type="password"
              id="password"
              name="password"
              placeholder="Set a password"
              value={userData.password}
              onChange={handleChange}
              required
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-base font-semibold text-black"
            >
              Email
            </label>
            <input
              className="w-full mt-3 py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600"
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={userData.email}
              onChange={handleChange}
              required
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center w-full mb-0">
              <input
                type="checkbox"
                name="checkbox"
                id="checkbox"
                className="rounded border-gray-200 text-indigo-600 focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50 me-2"
              />
              <label htmlFor="checkbox" className="text-slate-400">
                I Accept
                <a href="" className="text-indigo-600 hover:text-blue-500">
                  {" "}
                  Terms And Conditions
                </a>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full"
              disabled={isLoading}
            >
              {/* Disable button during loading */}
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <div className="text-center mt-2">
              <span className="text-slate-400 me-2">
                Already have an account?
              </span>
              <a href="/login" className="underline text-indigo-600 hover:text-blue-500">
                Sign In
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
