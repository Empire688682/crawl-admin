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
    description: "",
    artists_names: [""],
    lyrics: ""
  });

  const [coverArt, setCoverArt] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isHandlingUploading, setIsHandlingUploading] = useState(false);

  // ✅ Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
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
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Please drop a valid image file.");
        return;
      }
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
      if (!file) {
        setIsAudioUploading(false);
        return;
      }
      
      if (!file.type.startsWith("audio/") || 
          (file.type !== "audio/mpeg" && !file.name.toLowerCase().endsWith(".mp3"))) {
        toast.error("Only MP3 files are allowed.");
        setIsAudioUploading(false);
        return;
      }
      
      const audioUrl = await uploadAudio(file);
      setAudioFile(audioUrl);
      setAudioPreview(audioUrl);
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
      !userData?.token ||
      !artistData?.ID ||
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
      const uploadData = {
        title: formData.title,
        artistId: artistData.ID,
        artists_names: formData.artists_names.filter(name => name.trim()),
        duration: Number(formData.duration),
        audioUrl: audioFile,
        genreId: "6db4110f-cc55-4c7a-ad5e-2e13b192143f",
        albumId: "8cdca3c1-5149-4d1a-9b73-c4018642cd45",
        price: Number(formData.price),
        lyrics: formData.lyrics,
        releaseDate: new Date(formData.releaseDate).toISOString(),
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

      console.log("res:", res);

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
          lyrics: "",
          description: ""
        });
        setAudioFile(null);
        setAudioPreview(null);
        setCoverArt(null);
        setCoverPreview(null);
        setPreviewUrl(null);
        toast.success("Song uploaded successfully!");
        setTimeout(() => {
          router.push("/all-songs");
        }, 1000);
      }
    } catch (error) {
      console.error("handleUploadSong:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload song!";
      toast.error(errorMessage);
    } finally {
      setIsHandlingUploading(false);
    }
  };

  // ✅ Upload Album Handler
  const handleAlbumCreated = async (e) => {
    e.preventDefault();
    setIsHandlingUploading(true);
    
    // Validation
    if (
      !formData.title ||
      !userData?.token ||
      !artistData?.ID ||
      !formData.price ||
      !formData.releaseDate ||
      !coverArt ||
      !formData.description
    ) {
      setIsHandlingUploading(false);
      return toast.error("All required fields must be filled!");
    }

    try {
      const uploadData = {
        title: formData.title,
        artistId: artistData.ID,
        price: Number(formData.price),
        releaseDate: new Date(formData.releaseDate).toISOString(),
        coverImageUrl: coverArt,
        description: formData.description
      };

      console.log("uploadAlbumData:", uploadData);

      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "albums",
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`,
          }
        }
      );

      console.log("res:", res);

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
          lyrics: "",
          description: ""
        });
        setAudioFile(null);
        setAudioPreview(null);
        setCoverArt(null);
        setCoverPreview(null);
        setPreviewUrl(null);
        toast.success("Album created successfully!");
        // Store the actual album ID from response
        if (res.data?.id) {
          localStorage.setItem("albumId", JSON.stringify(res.data.id));
        }
        setTimeout(() => {
          router.push("/albums");
        }, 1000);
      }
    } catch (error) {
      console.error("handleAlbumCreated:", error);
      const errorMessage = error.response?.data?.message || "Failed to create album!";
      toast.error(errorMessage);
    } finally {
      setIsHandlingUploading(false);
    }
  };

  const handleSongAlbumPosting = (e) => {
    e.preventDefault();
    if (isAlbum) {
      handleAlbumCreated(e);
    } else {
      handleUploadSong(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 text-white">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">
        {isAlbum ? "Create Album" : "Upload Song"}
      </h1>

      <form className="space-y-6" onSubmit={handleSongAlbumPosting}>
        {/* Type toggle */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setIsAlbum(false)}
            className={`px-4 py-2 rounded cursor-pointer transition-colors ${
              !isAlbum ? "bg-white text-black" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setIsAlbum(true)}
            className={`px-4 py-2 rounded cursor-pointer transition-colors ${
              isAlbum ? "bg-white text-black" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Album
          </button>
        </div>

        {/* Cover upload */}
        <div
          onDrop={handleImageDrop}
          onDragOver={preventDefaults}
          onDragEnter={preventDefaults}
          className="w-full border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer hover:border-gray-400 transition-colors"
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
            className="inline-block mt-2 px-4 py-1 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
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
        {!isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Song File (MP3) *
            </label>
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
        )}

        {/* Audio preview */}
        {isAudioUploading && (
          <div className="flex items-center gap-2 text-blue-500 text-sm">
            <span className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></span>
            Uploading audio...
          </div>
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
          <label className="block text-sm font-medium mb-1">
            {isAlbum ? "Album Title" : "Song Title"} *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Artist Names */}
        {!isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1">Artist Names *</label>
            {formData.artists_names.map((name, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  value={name}
                  onChange={(e) => handleArtistNameChange(index, e.target.value)}
                  placeholder={`Artist ${index + 1} name`}
                  className="flex-1 px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required={index === 0}
                />
                {formData.artists_names.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArtistName(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addArtistName}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Another Artist
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Release Date *</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
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
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {!isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1">Duration (seconds) *</label>
            <input
              type="number"
              name="duration"
              placeholder="Duration in seconds (e.g., 180 for 3 minutes)"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        )}

        {!isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1">Lyrics *</label>
            <textarea
              name="lyrics"
              cols="30"
              rows="4"
              placeholder="Song lyrics"
              className="w-full resize-none px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              onChange={handleInputChange}
              value={formData.lyrics}
            />
          </div>
        )}

        {isAlbum && (
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              cols="30"
              rows="4"
              placeholder="Album description"
              className="w-full resize-none px-4 py-2 bg-gray-800 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              onChange={handleInputChange}
              value={formData.description}
            />
          </div>
        )}

        {/* Submit */}
        <button
          disabled={isHandlingUploading}
          type="submit"
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isHandlingUploading 
            ? "Uploading..." 
            : isAlbum 
              ? "Create Album" 
              : "Upload Song"
          }
        </button>
      </form>
    </div>
  );
}