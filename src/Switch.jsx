import { Route, Routes } from "react-router-dom"
import Login from "./comps/Login";
import Register from "./comps/Register";
import Chat from "./comps/Chat";
import SetAvatar from "./comps/SetAvatar";

const Switch = () => {
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setAvatar" element={<SetAvatar />} />
            <Route path="/" element={<Chat />} />
        </Routes>
    )
}

export default Switch