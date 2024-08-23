import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";

const SideNav = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!auth?.token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div></div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-75 p-4">
          <li className="mb-4">
            <div className="flex flex-col items-center">
              <div className="avatar mb-2">
                <NavLink to="/profile" className="avatar mb-2">
                  <div className="w-24 rounded-full">
                    {auth.avatar && <img src={auth.avatar} alt="avatar" />}
                  </div>
                </NavLink>
              </div>
              <span className="font-semibold">{auth.username}</span>
            </div>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "text-primary" : "text-base-content"
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                isActive ? "text-primary" : "text-base-content"
              }
            >
              Chat
            </NavLink>
          </li>
          <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm px-4 py-2"
            >
              Logout
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
