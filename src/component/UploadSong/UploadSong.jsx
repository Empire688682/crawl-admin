"use client";
import { useState } from "react";
import uploadImage from "../Functions/uploadImage";
import uploadAudio from "../Functions/uploadAudio";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useGlobalContext } from "../Context";
import axios from "axios";

export default function UploadSong() {
  const { userData, router } = useGlobalContext();

  const [isAlbum, setIsAlbum] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    album: "",
    genre: "",
    releaseDate: "",
    price: "",
    duration: "",
  });

  const [coverArt, setCoverArt] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isHandlingUploading, setIsHandlingUploading] = useState(false);

  // ✅ Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "releaseDate") {
      const isoDate = new Date(value).toISOString();
      setFormData((prev) => ({
        ...prev,
        [name]: isoDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Image Upload Handlers
  const handleImageSelect = async (e) => {
    try {
      setIsImgUploading(true);
      const file = e.target.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      const imageUrl = await uploadImage(file);
      setCoverPreview(imageUrl);
      setCoverArt(imageUrl);
    } catch (error) {
      console.error("handleImageSelect:", error);
      toast.error("Image upload failed, try again.");
      setCoverArt(null);
      setCoverPreview(null);
    } finally {
      setIsImgUploading(false);
    }
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    setIsImgUploading(true);
    try {
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      const imageUrl = await uploadImage(file);
      setCoverPreview(imageUrl);
      setCoverArt(imageUrl);
    } catch (error) {
      console.error("handleImageDrop:", error);
      toast.error("Image upload failed, try again.");
      setCoverPreview(null);
      setCoverArt(null);
    } finally {
      setIsImgUploading(false);
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ✅ Audio Upload Handler
  const handleAudioSelect = async (e) => {
    setIsAudioUploading(true);
    try {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith("audio/")) return;
      if (
        !file ||
        file.type !== "audio/mpeg" ||                         // checks MIME type
        !file.name.toLowerCase().endsWith(".mp3")             // checks file extension
      ) {
        toast.error("Only MP3 files are allowed.");
        return;
      }
      const audioUrl = await uploadAudio(file);
      setAudioFile(audioUrl);
      setAudioPreview(audioUrl);
    } catch (error) {
      console.error("handleAudioSelect:", error);
      toast.error("Audio upload failed, try again.");
      setAudioPreview(null);
      setAudioFile(null);
    } finally {
      setIsAudioUploading(false);
    }
  };

  // ✅ Upload Song Handler
  const handleUploadSong = async (e) => {
    e.preventDefault();
    setIsHandlingUploading(true);

    if (
      !formData.title ||
      !userData.token ||
      !userData.first_name ||
      !formData.genre ||
      !formData.price ||
      !formData.duration ||
      !audioFile ||
      !formData.releaseDate ||
      !coverArt ||
      !coverPreview ||
      !audioFile ||
      !audioPreview
    ) {
      setIsHandlingUploading(false);
      return toast.error("All fields required!");
    }

    const now = new Date().toISOString();

    try {
      const uploadData = {
        title: formData.title,
        artist_id: userData?.id,
        artists_names: `${userData.first_name} ${userData.last_name}`,
        cover_art: coverPreview,
        genre: formData.genre,
        price: Number(formData.price),
        duration: Number(formData.duration),
        audio_url: audioFile,
        release_date: formData.releaseDate,
        is_purchased: false,
        album_id: null,
        created_at: now,
        updated_at: now,
        deleted_at: "2025-06-11T11:01:42.565Z",
      };

      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "songs",
        uploadData
      );

      if (res.status === 201) {
        setFormData({
          title: "",
          album: "",
          genre: "",
          releaseDate: "",
          price: "",
          duration: "",
        });
        setAudioFile(null);
        setAudioPreview(null);
        setCoverArt(null);
        setCoverPreview(null);
        toast.success("Song uploaded successfully!");
        setTimeout(()=>{
          router.push("/all-songs")
        }, 1000);
      }
    } catch (error) {
      console.error("handleUploadSong:", error);
      toast.error("Failed to upload song!");
    } finally {
      setIsHandlingUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 text-white">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Upload Song</h1>

      <form className="space-y-6" onSubmit={handleUploadSong}>
        {/* Type toggle */}
        <div className="flex space-x-4">
          <p
            onClick={() => setIsAlbum(false)}
            className={`px-4 py-2 rounded cursor-pointer ${!isAlbum ? "bg-white text-black" : "bg-gray-700"
              }`}
          >
            Single
          </p>
          {/* Album toggle (if needed) */}
          {/* <p
            onClick={() => setIsAlbum(true)}
            className={`px-4 py-2 rounded cursor-pointer ${
              isAlbum ? "bg-white text-black" : "bg-gray-700"
            }`}
          >
            Album
          </p> */}
        </div>

        {/* Cover upload */}
        <div
          onDrop={handleImageDrop}
          onDragOver={preventDefaults}
          className="w-full border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer"
        >
          <p className="mb-2">Drag & drop your cover or song here</p>
          <p className="text-sm text-gray-400">or click to select manually</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="inline-block mt-2 px-4 py-1 bg-gray-700 rounded cursor-pointer"
          >
            Browse
          </label>
        </div>

        {/* Cover preview */}
        {isImgUploading ? (
          <div className="flex items-center gap-2 p-3 rounded-md bg-gray-100 text-sm text-gray-600 w-fit">
            <span className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></span>
            Uploading image...
          </div>
        ) : (
          coverPreview && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Cover Art Preview:
              </label>
              <img
                src={coverPreview}
                alt="Upload Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )
        )}

        {/* Audio upload */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Song File (MP3)</label>
          <input
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={handleAudioSelect}
            className="block w-full text-sm text-gray-300
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100
               bg-gray-800 border border-gray-600 rounded"
          />
        </div>

        {/* Audio preview */}
        {isAudioUploading && (
          <div className="text-blue-500 text-sm">Uploading audio...</div>
        )}
        {audioPreview && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Audio Preview:
            </label>
            <audio controls src={audioPreview} className="w-full h-[30px]" />
          </div>
        )}

        {/* Form fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        {isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1">Album Name</label>
            <input
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <input
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate ? formData.releaseDate.split("T")[0] : ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-400 rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration</label>
          <input
            type="number"
            name="duration"
            placeholder="example 1m:60, 2m:120, 3m:180.... "
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        {/* Submit */}
        <button
          disabled={isHandlingUploading}
          type="submit"
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {isHandlingUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
