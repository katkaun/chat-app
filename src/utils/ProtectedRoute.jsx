import { useContext } from "react"
import AuthContext from "../context/AuthProvider"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
  
    return auth.userId ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace state={{ protectedRoute: true }} />
      );
    };
    
    export default ProtectedRoute;