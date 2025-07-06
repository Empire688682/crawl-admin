"use client";
import { useState } from "react";
import uploadImage from "../Functions/uploadImage";
import uploadAudio from "../Functions/uploadAudio";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useGlobalContext } from "../Context";
import axios from "axios";

export default function UploadSong() {
  const { userData, artistData, router } = useGlobalContext();

  const [isAlbum, setIsAlbum] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    albumId: "",
    genreId: "",
    releaseDate: "",
    price: "",
    duration: "",
    artists_names: [""],
    lyrics: "" // Array of artist names
  });

  const [coverArt, setCoverArt] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For preview audio if different from main audio
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isHandlingUploading, setIsHandlingUploading] = useState(false);

  // ✅ Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "releaseDate") {
      // Keep as YYYY-MM-DD format for backend
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle artist names array
  const handleArtistNameChange = (index, value) => {
    const newArtistNames = [...formData.artists_names];
    newArtistNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      artists_names: newArtistNames,
    }));
  };

  const addArtistName = () => {
    setFormData((prev) => ({
      ...prev,
      artists_names: [...prev.artists_names, ""],
    }));
  };

  const removeArtistName = (index) => {
    if (formData.artists_names.length > 1) {
      const newArtistNames = formData.artists_names.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        artists_names: newArtistNames,
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
        file.type !== "audio/mpeg" ||
        !file.name.toLowerCase().endsWith(".mp3")
      ) {
        toast.error("Only MP3 files are allowed.");
        return;
      }
      const audioUrl = await uploadAudio(file);
      setAudioFile(audioUrl);
      setAudioPreview(audioUrl);
      // Set preview URL same as main audio by default
      setPreviewUrl(audioUrl);
    } catch (error) {
      console.error("handleAudioSelect:", error);
      toast.error("Audio upload failed, try again.");
      setAudioPreview(null);
      setAudioFile(null);
      setPreviewUrl(null);
    } finally {
      setIsAudioUploading(false);
    }
  };

  // ✅ Upload Song Handler
  const handleUploadSong = async (e) => {
    e.preventDefault();
    setIsHandlingUploading(true);
    // Validation
    if (
      !formData.title ||
      !userData.token ||
      !artistData.ID ||
      //!formData.genreId ||
      !formData.price ||
      !formData.duration ||
      !audioFile ||
      !formData.releaseDate ||
      !coverArt ||
      !formData.lyrics ||
      !formData.artists_names.some(name => name.trim())
    ) {
      setIsHandlingUploading(false);
      return toast.error("All required fields must be filled!");
    }

    try {
      // Format data according to backend expectations
      const uploadData = {
        title: formData.title,
        artistId: "urn:uuid:" + artistData?.ID, // Use artistId instead of artist_id
        artists_names: formData.artists_names.filter(name => name.trim()), // Filter out empty names
        duration: Number(formData.duration),
        audioUrl: audioFile, 
        genreId: "", // formData.genreId, 
        price: Number(formData.price),
        lyrics: formData.lyrics,
        releaseDate: new Date(formData.releaseDate).toISOString(), 
        albumId: "", //formData.albumId
        previewUrl: previewUrl,
        coverImageUrl: coverArt,
      };
      console.log("uploadData:", uploadData);

      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "songs",
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`,
          }
        }
      );

      console.log("res:", res)

      if (res.status === 201) {
        // Reset form
        setFormData({
          title: "",
          albumId: "",
          genreId: "",
          releaseDate: "",
          price: "",
          duration: "",
          artists_names: [""],
          lyrics: ""
        });
        setAudioFile(null);
        setAudioPreview(null);
        setCoverArt(null);
        setCoverPreview(null);
        setPreviewUrl(null);
        toast.success("Song uploaded successfully!");
        setTimeout(() => {
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
          <p
            onClick={() => setIsAlbum(true)}
            className={`px-4 py-2 rounded cursor-pointer ${
              isAlbum ? "bg-white text-black" : "bg-gray-700"
            }`}
          >
            Album
          </p>
        </div>

        {/* Cover upload */}
        <div
          onDrop={handleImageDrop}
          onDragOver={preventDefaults}
          className="w-full border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer"
        >
          <p className="mb-2">Drag & drop your cover image here</p>
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
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
            required
          />
        </div>

        {/* Artist Names */}
        <div>
          <label className="block text-sm font-medium mb-1">Artist Names *</label>
          {formData.artists_names.map((name, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={name}
                onChange={(e) => handleArtistNameChange(index, e.target.value)}
                placeholder={`Artist ${index + 1} name`}
                className="flex-1 px-4 py-2 bg-gray-800 rounded border border-gray-600"
                required={index === 0}
              />
              {formData.artists_names.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArtistName(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addArtistName}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Another Artist
          </button>
        </div>

        {isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1">Album ID</label>
            <input
              name="albumId"
              value={formData.albumId}
              onChange={handleInputChange}
              placeholder="urn:uuid:example-album-id"
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
            />
          </div>
        )}

        {/* <div>
          <label className="block text-sm font-medium mb-1">Genre ID *</label>
          <input
            name="genreId"
            value={formData.genreId}
            onChange={handleInputChange}
            placeholder="urn:uuid:example-genre-id"
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
            required
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium mb-1">Release Date *</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-400 rounded border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price in cents/smallest currency unit"
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (seconds) *</label>
          <input
            type="number"
            name="duration"
            placeholder="Duration in seconds (e.g., 180 for 3 minutes)"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lyrics*</label>
          <textarea 
          name="lyrics" 
          id="" 
          cols="30" 
          rows="4"
          placeholder="Song lyrics"
          className="w-full resize-none px-4 py-2 bg-gray-800 rounded border border-gray-600"
          onChange={handleInputChange}
          value={formData.lyrics}>
          </textarea>
        </div>

        {/* Submit */}
        <button
          disabled={isHandlingUploading}
          type="submit"
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {isHandlingUploading ? "Uploading..." : "Upload Song"}
        </button>
      </form>
    </div>
  );
}