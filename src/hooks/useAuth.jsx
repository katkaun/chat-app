// const useAuth = () => {
//     const [error, setError] = useState(null);
  
//     const login = async (username, password, csrfToken) => {
//       try {
//         // Step 1: Perform the login request to get the token
//         const response = await fetch("https://chatify-api.up.railway.app/auth/token", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ username, password, csrfToken }),
//         });
  
//         const data = await response.json();
  
//         if (response.ok && data.token) {
//           // Step 2: Fetch user details using the obtained token
//           const userResponse = await fetch(`https://chatify-api.up.railway.app/users`, {
//             method: "GET",
//             headers: {
//               "Authorization": `Bearer ${data.token}`,
//               "Accept": "application/json",
//             },
//           });
  
//           const userData = await userResponse.json();
  
//           if (userResponse.ok && userData.length > 0) {
//             // Assuming userData is an array with one user object
//             const user = userData[0];
//             return {
//               success: true,
//               userPayload: {
//                 token: data.token,
//                 userId: user.userId,
//                 username: user.username,
//                 avatar: user.avatar,
//                 email: user.email, // Adjust if needed
//               },
//             };
//           } else {
//             throw new Error("Failed to fetch user details.");
//           }
//         } else {
//           throw new Error(data.error || "Login failed.");
//         }
//       } catch (err) {
//         setError(err.message);
//         return { success: false, error: err.message };
//       }
//     };
  
//     return { login, error };
//   };
  
//   export default useAuth;