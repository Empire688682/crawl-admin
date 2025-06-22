"use client"
import { useState, useRef } from 'react';
import uploadImage from '../Functions/uploadImage';
import uploadAudio from '../Functions/uploadAudio';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useGlobalContext } from '../Context';
import axios from 'axios';

export default function UploadSong() {
  const {userData} = useGlobalContext();
  const [isAlbum, setIsAlbum] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    album: '',
    genre: '',
    releaseDate: '',
    price: '',
    duration: ""
  });
  const [coverArt, setCoverArt] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isHandlingUploading, setIsHandlingUploading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = async (e) => {
    try {
      setIsImgUploading(true);
      const file = e.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const imageUrl = await uploadImage(file);
      setCoverPreview(imageUrl);
      setCoverArt(imageUrl);
    } catch (error) {
      console.log("handleImageSelect:", error);
      toast("Image upload failed, try again.");
      setCoverArt(null);
      setCoverPreview(null);
    }
    finally {
      setIsImgUploading(false);
    }
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    setIsImgUploading(true);
    try {
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const imageUrl = await uploadImage(file);
      setCoverPreview(imageUrl);
      setCoverArt(imageUrl);
    } catch (error) {
      console.log("handleImageDrop:", error);
      toast("Image upload failed, try again.");
      setCoverPreview(null);
      setCoverArt(null);
    }
    finally {
      setIsImgUploading(false);
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAudioSelect = async (e) => {
    setIsAudioUploading(true);
    try {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith("audio/")) return;
      const audioUrl = await uploadAudio(file);
      setAudioFile(audioUrl);
      setAudioPreview(audioUrl);
    } catch (error) {
      console.log("handleAudioSelect:", error);
      toast("Audio upload failed, try again.");
      setAudioPreview(null);
      setAudioFile(null);
    }
    finally {
      setIsAudioUploading(false);
    }
  };

  const handleUploadSong = async (e) => {
    e.preventDefault();
    setIsHandlingUploading(true);
    console.log("formdata:", formData);
    if(!formData.title 
      || !userData.token
      || !userData.first_name
      || !formData.genre
      || !formData.price
      || !formData.duration
      || !audioFile
      || !formData.releaseDate){
        setIsHandlingUploading(false);
        return toast.error("All fileds required!")
      }
    try {
      const uploadData = {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: formData.title,
        artist_id: userData.token,
        artists_names: [
          userData.first_name,
          userData.last_name
        ],
        genre: formData.genre,
        price: Number(formData.price),
        duration: Number(formData.duration),
        audio_url: audioFile,
        release_date: formData.releaseDate,
        album_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        is_purchased: true,
        created_at: "2025-06-21T22:46:56.019Z",
        updated_at: "2025-06-21T22:46:56.019Z",
        deleted_at: "2025-06-21T22:46:56.019Z"
      }
      console.log("uploadData:", uploadData);
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "songs")
      console.log("res:", res);
      se
    } catch (error) {
      console.log("handleUploadSong:", error);
      toast("Failed to upload song!")
    }
    finally {
      setIsHandlingUploading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-10 text-white">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Upload Song</h1>

      <form className="space-y-6" onSubmit={handleUploadSong}>
        {/* Type toggle */}
        <div className="flex space-x-4">
          <button
            onClick={() => setIsAlbum(false)}
            className={`px-4 py-2 rounded ${!isAlbum ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            Single
          </button>
          <button
            onClick={() => setIsAlbum(true)}
            className={`px-4 py-2 rounded ${isAlbum ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            Album
          </button>
        </div>

        {/* Drag and Drop Area */}
        <div
          onDrop={handleImageDrop}
          onDragOver={preventDefaults}
          className="w-full border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer"
        >
          <p className="mb-2">Drag & drop your cover or song here</p>
          <p className="text-sm text-gray-400">or click to select manually</p>
          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="inline-block mt-2 px-4 py-1 bg-gray-700 rounded cursor-pointer">Browse</label>
        </div>

        {/* Preview */}
        {isImgUploading ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-md bg-gray-100 text-sm text-gray-600 w-fit">
            <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            <span>Uploading image...</span>
          </div>
        ) : (
          coverPreview && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Cover Art Preview:</label>
              <img src={coverPreview} alt="Upload Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )
        )}

        {/* Song */}

        <div>
          <label className="block text-sm text-white font-medium mb-1">Song File (MP3)</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioSelect}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                     file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          />
        </div>

        {/* Uploading indicator */}
        {isAudioUploading && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm w-fit">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Uploading audio…
          </div>
        )}

        {audioPreview && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Audio Preview:</label>
            <audio controls src={audioPreview} className="w-full h-[30px]" />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm text-white font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        {/* Album Name */}
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

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <input
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        {/* Price */}
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

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        {/* Submit Button */}
        <button disabled={isHandlingUploading} type="submit" className="w-full disabled:bg-gray-300 mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded">
          {
            isHandlingUploading ? "Uploading....." : "Upload"
          }
        </button>
      </form>
    </div>
  );
}
