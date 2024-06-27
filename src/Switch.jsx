import { Route, Routes } from "react-router-dom";
import Login from "./comps/Login";
import Register from "./comps/Register";
import Chat from "./comps/Chat";
import SetAvatar from "./comps/SetAvatar";
import ProtectedRoute from "./utils/ProtectedRoute";

const Switch = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Route>
    </Routes>
  );
};

export default Switch;
