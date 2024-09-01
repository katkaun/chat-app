import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const DeleteAccount = () => {
  const { removeAccount } = useContext(AuthContext);

  const handledeleteAccount = () => {
    removeAccount();
  };
  return (
    <button
      className="btn btn-error btn-sm mt-40"
      onClick={handledeleteAccount}
    >
      Delete Account
    </button>
  );
};

export default DeleteAccount;
