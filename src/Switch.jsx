import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./comps/Login";
import Register from "./comps/Register";
import Chat from "./comps/Chat";
import Profile from "./comps/Profile";
import NotFound from "./comps/NotFound";

const Switch = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Switch;