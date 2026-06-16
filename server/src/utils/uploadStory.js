import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadStoryToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const isVideo = mimetype.startsWith("video/");
    const mediaType = isVideo ? "video" : "image";

    const options = isVideo
      ? {
          resource_type: "video",
          folder: "stories/videos",
          transformation: [
            { width: 720, crop: "limit" },
            { video_codec: "h264", audio_codec: "aac", bit_rate: "500k", duration: 15 }
          ]
        }
      : {
          resource_type: "image",
          folder: "stories/images",
          transformation: [
            { width: 1080, crop: "limit", quality: 80, fetch_format: "auto" }
          ]
        };

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({
        mediaUrl: result.secure_url,
        mediaPublicId: result.public_id,
        mediaType
      });
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
