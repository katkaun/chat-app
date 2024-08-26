import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { fetchCsrfToken } from "../context/AuthProvider";

const DEFAULT_AVATAR_URL = "https://i.ibb.co/ByjrwLW/no-profile-picture-15257.png";
const AVATAR_OPTIONS = [
  { url: "https://i.ibb.co/gtgtGDS/deer.jpg", name: "Deer" },
  { url: "https://i.ibb.co/L8h7T8c/Owl.jpg", name: "Owl" },
  { url: "https://i.ibb.co/wN7Sgtq/racoon.jpg", name: "Racoon" },
  { url: "https://i.ibb.co/phD1PKc/hedgehog.jpg", name: "Hedgehog" },
];

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    avatar: DEFAULT_AVATAR_URL,
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const csrfToken = await fetchCsrfToken();
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    getCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

    try {
      await register(payload);
      setIsLoading(false);
      setUserData({
        username: "",
        password: "",
        email: "",
        avatar: DEFAULT_AVATAR_URL,
      });
      setRegMessage("Account created! Redirecting to sign-in...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setIsLoading(false);
      setRegMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div
        className="w-full max-w-md p-7 bg-white shadow-lg rounded-lg flex flex-col space-y-4"
        data-theme="cupcake"
      >
        <h5 className="text-2xl font-semibold text-primary text-center">
          Sign Up
        </h5>
        {regMessage && (
          <p
            className={`text-center text-base ${
              regMessage.includes("created") ? "text-green-500" : "text-red-500"
            }`}
          >
            {regMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              name="username"
              placeholder="Choose a unique username"
              value={userData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
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
              name="password"
              placeholder="Set a password"
              value={userData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-base font-semibold text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              className="input input-bordered w-full"
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={userData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">Choose Avatar:</label>
            <select
              className="input input-bordered w-full mb-2"
              name="avatar"
              value={userData.avatar}
              onChange={handleChange}
            >
              <option value={DEFAULT_AVATAR_URL}>No picture</option>
              {AVATAR_OPTIONS.map((avatar, index) => (
                <option key={index} value={avatar.url}>
                  {avatar.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="checkbox"
              id="checkbox"
              className="checkbox checkbox-primary"
            />
            <label htmlFor="checkbox" className="text-gray-600">
              I Accept
              <a
                href="#"
                className="text-secondary hover:text-secondary-focus ml-1"
              >
                Terms And Conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-secondary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="text-center">
          <span className="text-gray-500">Already have an account?</span>
          <a
            href="/login"
            className="text-secondary hover:text-secondary-focus ml-1"
          >
            Sign In
          </a>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          <a
            href="https://www.freepik.com/free-vector/hand-drawn-animal-avatars-element-collection_32969436.htm#fromView=search&page=1&position=31&uuid=10feff39-c646-42d1-bb03-918e276f0c9e"
            className="text-gray-500 hover:underline"
          >
            Image by Freepik
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;