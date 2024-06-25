import { Route, Routes } from "react-router-dom"
import Login from "./comps/Login";
import Register from "./comps/Register";
import Home from "./comps/Home";

const Switch = () => {
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default Switch