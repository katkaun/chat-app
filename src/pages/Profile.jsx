import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import PenIcon from "../comps/PenIcon";
import Modal from "../comps/Modal";
import ImgUploader from "../comps/ImgUploader";
import ProfileForm from "../comps/ProfileForm";

const Profile = () => {
  const { auth, updateUser } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(auth.avatar);

  useEffect(() => {
    setAvatar(auth.avatar);
  }, [auth]);

  const handleUploadSuccess = (imageUrl) => {
    setAvatar(imageUrl);
    setModalOpen(false); // Close the modal on successful upload
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <div className="relative">
        <img
          src={avatar}
          alt="Avatar"
          className="w-[150px] h-[150px] rounded-full border-2 border-gray-400 object-cover"
        />
        <button
          type="button"
          className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-indigo-800 hover:bg-indigo-700 border border-gray-600"
          title="Change photo"
          onClick={() => setModalOpen(true)}
        >
          <PenIcon />
        </button>
      </div>

      <h2 className="text-black font-bold text-3xl mt-4">{auth.username}</h2>
      <p className="text-gray-500 text-sm">{auth.email}</p>

      {modalOpen && (
        <Modal closeModal={() => setModalOpen(false)}>
          <ImgUploader onUploadSuccess={handleUploadSuccess} />
          <ProfileForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Profile;