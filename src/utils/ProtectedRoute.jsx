import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const ProtectedRoute = () => {
  const { auth } = useContext(AuthContext);

  console.log("Auth context in ProtectedRoute:", auth);

  if (!auth.token) {
    return <Navigate to="/login" replace state={{ protectedRoute: true }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;