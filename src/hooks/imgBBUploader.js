// export const uploadImageToImgBB = async (file) => {
//     const apiKey = "f3ca3b4af8d47af409b51e5b61224665"; 
//     const formData = new FormData();
//     formData.append("key", apiKey);
//     formData.append("image", file);
  
//     const apiUrl = "https://api.imgbb.com/1/upload";

//     try {
//       // Log FormData to verify contents
//       for (let [key, value] of formData.entries()) {
//         console.log(key, value);
//       }
  
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         body: formData,
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Network response was not ok: ${response.statusText}. Response body: ${errorText}`);
//       }
  
//       const data = await response.json();
  
//       if (data && data.data && data.data.url) {
//         return data.data.url; // Return the URL of the uploaded image
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       throw new Error(`Upload failed: ${error.message}`);
//     }
//   };