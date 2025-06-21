import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "rootgroup");

  console.log("data:", data);
  console.log("file:", file);
  try {
    const res = await axios.post('https://api.cloudinary.com/v1_1/dsddxqtss/image/upload', data);
    console.log("res:", res)
    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;