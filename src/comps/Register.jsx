import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { fetchCsrfToken } from "../context/AuthProvider";

const DEFAULT_AVATAR_URL =
  "https://i.ibb.co/mRR9Jy1/no-profile-picture-15257.png";

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
  const { register } = useContext(AuthContext);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const token = await fetchCsrfToken();
        setCsrfToken(token);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    getCsrfToken();
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
    const finalAvatarUrl = userData.avatar || DEFAULT_AVATAR_URL;

    setIsLoading(true);
    const payload = {
      ...userData,
      avatar: finalAvatarUrl,
      csrfToken,
    };

    console.log("Submitting registration with payload:", payload);

    try {
      await register(payload);
      setIsLoading(false);
      setUserData({
        username: "",
        password: "",
        email: "",
        avatar: "",
      });
      setRegMessage("Account created! Redirecting to sign-in...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setIsLoading(false);
      setRegMessage(error.message);
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
            <input
              className="w-full mt-3 py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600"
              type="text"
              name="avatar"
              value={userData.avatar}
              onChange={handleChange}
              placeholder="Avatar URL (optional)"
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
                <a href="" className="text-indigo-600 hover:text-indigo-800">
                  {" "}
                  Terms And Conditions
                </a>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="py-2 px-5 inline-block tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-800 border-indigo-600 hover:border-indigo-700 text-white rounded-md w-full"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <div className="text-center mt-2">
              <span className="text-slate-400 me-2">
                Already have an account?
              </span>
              <a
                href="/login"
                className="underline text-indigo-600 hover:text-indigo-800"
              >
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
