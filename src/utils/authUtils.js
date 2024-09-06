const BASE_URL = import.meta.env.VITE_API_URL;

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

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

export const fetchJwtToken = async (payload) => {
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
    console.log("Full login response:", result);

    if (result.token) {
      localStorage.setItem("jwtToken", result.token);
    }

    return result;
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};

export const decodeJwtToken = (token) => {
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

    console.log("Decoded Token:", decoded); // Debugging line

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Token has expired");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT token:", error.message);
    return null;
  }
};
