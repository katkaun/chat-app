import { useState, useContext } from "react";
import Modal from "./ui/Modal"; 
import AuthContext from "../context/AuthProvider";
import PenIcon from "./ui/PenIcon";
import ImgCropper from "./ui/ImgCropper";

const Profile = () => {
  const { auth, updateAvatar } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleUpdateAvatar = async (imageUrl) => {
    try {
      const response = await fetch(import.meta.env.VITE_RAILWAY_URL + "/user", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + auth.jwtToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.userId,
          updatedData: {
            avatar: imageUrl,
            email: auth.userEmail,
            username: auth.userName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      const data = await response.json();
      console.log("Avatar updated successfully:", data);
      setSuccessMessage("Avatar updated successfully!");
      setError(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setError("Error updating avatar: " + error.message);
      setSuccessMessage(null);
    }
  };

  return (
    <div className="flex flex-col items-center pt-12">
      <div className="relative">
        <img
          src={auth.avatar} // User's avatar
          alt="Avatar"
          className="w-[150px] h-[150px] rounded-full border-2 border-gray-400"
        />
        <button
          className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-indigo-800 hover:bg-indigo-700 border border-gray-600"
          title="Change photo"
          onClick={() => setModalOpen(true)}
        >
          <PenIcon />
        </button>
      </div>
      <h2 className="text-white font-bold mt-6">
        {auth.username || "Username"}
      </h2>
      <p className="text-gray-500 text-xs mt-2">{auth.email || "Email"}</p>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      {modalOpen && (
        <Modal closeModal={() => setModalOpen(false)}>
          <ImgCropper handleUpdateAvatar={handleUpdateAvatar} />
        </Modal>
      )}
    </div>
  );
};

export default Profile;

// import React, { useState, useContext, useRef } from "react";
// import Webcam from "react-webcam";
// import AuthContext from "../context/AuthProvider";

// const Profile = () => {
//   const { auth, updateAvatar } = useContext(AuthContext);
//   const [webcamEnabled, setWebcamEnabled] = useState(false);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [tempImage, setTempImage] = useState(null); // Temporary state for preview
//   const webcamRef = useRef(null);

//   console.log('Current avatar URL:', auth.avatar);
//   console.log('Uploaded image preview:', uploadedImage);

//   const handleCapturePhoto = () => {
//     const screenshot = webcamRef.current.getScreenshot();
//     updateAvatar(screenshot);
//     setTempImage(screenshot); // Set the captured image as a temporary preview
//   };

//   const handleUploadPhoto = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onloadend = () => {
//       if (reader.result) {
//         setUploadedImage(reader.result); // Set the uploaded image for preview
//         setTempImage(reader.result); // Set the uploaded image as a temporary preview
//       }
//     };

//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle the removal of the uploaded photo
//   const handleRemovePhoto = () => {
//     setUploadedImage(null); // Clear uploaded image
//     setTempImage(null); // Clear temporary preview
//     updateAvatar(''); // Update avatar to remove current image
//   };

//   // Use the temporary image (if any), uploaded image, or current avatar
//   const avatarSrc = tempImage || uploadedImage || auth.avatar || "default-avatar-url.jpg";

//   return (
//     <div>
//       <h2>Profile</h2>
//       <img
//         src={avatarSrc}
//         alt="Avatar Preview"
//         style={{ width: "150px", height: "150px", borderRadius: "50%" }}
//       />
//       <div>
//         <button onClick={() => setWebcamEnabled(!webcamEnabled)}>
//           {webcamEnabled ? "Close Webcam" : "Open Webcam"}
//         </button>
//         {webcamEnabled && (
//           <div>
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               screenshotFormat="image/jpeg"
//               width={320}
//               height={240}
//             />
//             <button onClick={handleCapturePhoto}>Capture Photo</button>
//           </div>
//         )}
//       </div>
//       <div>
//         <input type="file" accept="image/*" onChange={handleUploadPhoto} />
//         <button onClick={handleRemovePhoto}>Remove Photo</button>
//       </div>
//     </div>
//   );
// };

// export default Profile;
