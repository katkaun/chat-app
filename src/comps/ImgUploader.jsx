import { useState } from "react";

const ImgUploader = ({ onUploadSuccess }) => {
  const [newFile, setNewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

      console.log("Response Status:", response.status); // Logga status
      if (!response.ok) {
        const responseBody = await response.text();
        console.error("API Error Response:", responseBody);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response Data:", data); // Logga data
      return data.data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Upload failed: " + error.message);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
  
      // Clean up object URL when the component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  const handleUpload = async () => {
    if (!newFile) {
      console.error("No file selected for upload.");
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setUploadSuccess(false);

    try {
      console.time("Image Upload");

      const imageUrl = await uploadImageToImgBB(newFile);
      console.timeEnd("Image Upload");

      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
      setUploadSuccess(true);
      
    } catch (error) {
      setError("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <label className="block mb-3">
        <span className="sr-only">Choose profile picture</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block mb-3 text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
        />
      </label>

      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border border-gray-300"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        className="text-white text-xs py-2 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {uploadSuccess && (
        <p className="text-green-500 text-xs mt-2">Upload successful!</p>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImgUploader;

