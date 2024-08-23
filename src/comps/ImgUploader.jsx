import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider";

const ImgUploader = ({ onUpdateUser }) => {
  const { auth, updateUser } = useContext(AuthContext);
  const [tempFile, setTempFile] = useState(null);
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize the temporary state with current user data
    setTempUsername(auth.username || "");
    setTempEmail(auth.email || "");
  }, [auth]);

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("key", "f3ca3b4af8d47af409b51e5b61224665"); 
    formData.append("image", file);

    const apiUrl = "https://api.imgbb.com/1/upload";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const responseBody = await response.text();
        console.error("API Error Response:", responseBody);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Upload failed: " + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const updatedUser = {
        username: tempUsername,
        email: tempEmail,
      };

      if (tempFile) {
        const uploadedImageUrl = await uploadImageToImgBB(tempFile);
        updatedUser.avatar = uploadedImageUrl;
      }

      await updateUser(updatedUser);
      setError("");
    } catch (error) {
      setError("Failed to update user details: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <label className="block mb-3">
          <span className="sr-only">Choose profile picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTempFile(e.target.files?.[0] || null)}
            className="block mb-3 text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
          />
        </label>
        <div className="mb-3">
  <label
    htmlFor="username"
    className="block text-sm font-medium text-gray-700"
  >
    Username
  </label>
  <input
    id="username"
    type="text"
    value={tempUsername}
    onChange={(e) => setTempUsername(e.target.value)}
    className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50"
  />
</div>
<div className="mb-3">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-gray-700"
  >
    Email
  </label>
  <input
    id="email"
    type="email"
    value={tempEmail}
    onChange={(e) => setTempEmail(e.target.value)}
    className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50"
  />
</div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          className="text-white font-mono text-xs py-2 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ImgUploader;


// import { useRef, useState } from "react";
// import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// const ASPECT_RATIO = 1;
// const MIN_DIMENSION = 150;

// const ImgCropper = ({ onUploadSuccess }) => {
//   const [imgSrc, setImgSrc] = useState("");
//   const [crop, setCrop] = useState();
//   const [error, setError] = useState("");
//   const canvasRef = useRef(null);

//   const onSelectFile = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const imageElement = new Image();
//       imageElement.src = reader.result;
//       imageElement.onload = () => {
//         const { naturalWidth, naturalHeight } = imageElement;
//         if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
//           setError("Image must be at least 150 x 150 pixels.");
//           return setImgSrc("");
//         }
//         const crop = makeAspectCrop(
//           {
//             unit: "%",
//             width: 25,
//           },
//           ASPECT_RATIO,
//           imageElement.width,
//           imageElement.height
//         );
//         setCrop(centerCrop(crop, imageElement.width, imageElement.height));
//         setImgSrc(reader.result);
//       };
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleCropImage = async () => {
//     if (!canvasRef.current || !imgSrc || !crop) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const image = new Image();

//     image.onload = async () => {
//       const scaleX = image.naturalWidth / image.width;
//       const scaleY = image.naturalHeight / image.height;

//       canvas.width = crop.width * scaleX;
//       canvas.height = crop.height * scaleY;

//       ctx.drawImage(
//         image,
//         crop.x * scaleX,
//         crop.y * scaleY,
//         crop.width * scaleX,
//         crop.height * scaleY,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );

//       const croppedImageDataURL = canvas.toDataURL("image/png");

//       try {
//         // Convert dataURL to blob
//         const blob = await fetch(croppedImageDataURL).then((res) => res.blob());
//         const file = new File([blob], "cropped-image.png", {
//           type: "image/png",
//         });

//         // Upload the cropped image to ImgBB
//         const uploadedImageUrl = await uploadImageToImgBB(file);

//         // Notify the parent component of the successful upload
//         if (typeof onUploadSuccess === "function") {
//           onUploadSuccess(uploadedImageUrl);
//         } else {
//           console.error("onUploadSuccess is not a function");
//         }
//       } catch (error) {
//         setError("Upload failed: " + error.message);
//       }
//     };
//     image.src = imgSrc;
//   };

//   return (
//     <>
//       <label className="block mb-3 w-fit">
//         <span className="sr-only">Choose profile picture</span>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onSelectFile}
//           className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
//         />
//       </label>
//       {error && <p className="text-red-400 text-xs">{error}</p>}
//       {imgSrc && (
//         <div className="flex flex-col items-center">
//           <ReactCrop
//             crop={crop}
//             onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
//             circularCrop
//             keepSelection
//             aspect={ASPECT_RATIO}
//             minWidth={MIN_DIMENSION}
//           >
//             <img
//               src={imgSrc}
//               alt="Upload"
//               style={{ maxHeight: "70vh" }}
//               onLoad={() => console.log("Image loaded")}
//             />
//           </ReactCrop>
//           <button
//             className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
//             onClick={handleCropImage}
//           >
//             Crop and Upload Image
//           </button>
//         </div>
//       )}
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </>
//   );
// };

// export default ImgCropper;
