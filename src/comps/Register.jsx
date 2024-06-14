import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
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
        setRegMessage(
          "Registration successful! Redirecting you to the sign-in page..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setRegMessage(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error", error);
      setRegMessage("Registration failed due to a network error.");
    }
  };

  return (
    <div>
      <h3>Register here!</h3>
      {regMessage && <p>{regMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            placeholder="Choose a unique username"
            value={userData.username}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable input during loading
          />
        </label>
        <br />
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Enter a strong password"
            value={userData.password}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable input during loading
          />
        </label>
        <br />
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={userData.email}
            onChange={handleChange}
            required
            disabled={isLoading} // Disable input during loading
          />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {" "}
          {/* Disable button during loading */}
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
