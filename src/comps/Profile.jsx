import React, { useState, useContext, useRef } from "react";
import Webcam from "react-webcam";
import AuthContext from "../context/AuthProvider";

const Profile = () => {
  const { auth, updateAvatar } = useContext(AuthContext);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [tempImage, setTempImage] = useState(null); // Temporary state for preview
  const webcamRef = useRef(null);

  console.log('Current avatar URL:', auth.avatar);
  console.log('Uploaded image preview:', uploadedImage);

  const handleCapturePhoto = () => {
    const screenshot = webcamRef.current.getScreenshot();
    updateAvatar(screenshot);
    setTempImage(screenshot); // Set the captured image as a temporary preview
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        setUploadedImage(reader.result); // Set the uploaded image for preview
        setTempImage(reader.result); // Set the uploaded image as a temporary preview
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle the removal of the uploaded photo
  const handleRemovePhoto = () => {
    setUploadedImage(null); // Clear uploaded image
    setTempImage(null); // Clear temporary preview
    updateAvatar(''); // Update avatar to remove current image
  };

  // Use the temporary image (if any), uploaded image, or current avatar
  const avatarSrc = tempImage || uploadedImage || auth.avatar || "default-avatar-url.jpg";

  return (
    <div>
      <h2>Profile</h2>
      <img
        src={avatarSrc}
        alt="Avatar Preview"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <div>
        <button onClick={() => setWebcamEnabled(!webcamEnabled)}>
          {webcamEnabled ? "Close Webcam" : "Open Webcam"}
        </button>
        {webcamEnabled && (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
            />
            <button onClick={handleCapturePhoto}>Capture Photo</button>
          </div>
        )}
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleUploadPhoto} />
        <button onClick={handleRemovePhoto}>Remove Photo</button>
      </div>
    </div>
  );
};

export default Profile;
