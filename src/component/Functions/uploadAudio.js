import axios from "axios";

const uploadAudio = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "jayempire");

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      data
    );
    const { secure_url } = res.data;
    return secure_url;
  } catch (err) {
    console.error("Audio upload failed:", err?.response?.data || err);
    throw err;
  }
};

export default uploadAudio;
