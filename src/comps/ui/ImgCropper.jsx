import { useContext, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import AuthContext from "../../context/AuthProvider";
import "react-image-crop/dist/ReactCrop.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImgCropper = ({ handleUpdateAvatar }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const canvasRef = useRef(null);
  const { updateAvatar } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState('');


  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageElement = new Image();
      imageElement.src = reader.result;
      imageElement.onload = () => {
        const { naturalWidth, naturalHeight } = imageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
        const crop = makeAspectCrop(
          {
            unit: "%",
            width: 25,
          },
          ASPECT_RATIO,
          imageElement.width,
          imageElement.height
        );
        setCrop(centerCrop(crop, imageElement.width, imageElement.height));
        setImgSrc(reader.result);
      };
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      setError("Image must be at least 150 x 150 pixels.");
      setImgSrc("");
      return;
    }
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 25,
      },
      ASPECT_RATIO,
      width,
      height
    );
    setCrop(centerCrop(crop, width, height));
  };

  const handleCropImage = () => {
    if (!canvasRef.current || !imgSrc || !crop) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
  
    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
  
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
  
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
  
      const croppedImageDataURL = canvas.toDataURL("image/png");
      setCroppedImageUrl(croppedImageDataURL);
      uploadToImgBB(croppedImageDataURL); // Pass the data URL here
    };
    image.src = imgSrc;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('key', 'f3ca3b4af8d47af409b51e5b61224665'); // Your ImgBB API key
    formData.append('image', file);

    const apiUrl = 'https://api.imgbb.com/1/upload';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const uploadedImageUrl = data.data.url;
      setImageUrl(uploadedImageUrl);
      handleUpdateAvatar(uploadedImageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed: ' + error.message);
    }
  };
  
  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile picture</span>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
            onClick={handleCropImage}
          >
            Crop and Upload Image
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default ImgCropper;
