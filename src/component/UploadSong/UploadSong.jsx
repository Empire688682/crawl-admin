"use client"
import { useState, useRef } from 'react';
import upload from '../Functions/uploadImage';

export default function UploadSong() {
  const [isAlbum, setIsAlbum] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    album: '',
    genre: '',
    releaseDate: '',
    price: '',
  });
  const [coverArt, setCoverArt] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isImgUploading, setIsImgUploading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = async (e) => {
    try {
      setIsImgUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      if (file.type.startsWith('image/')) {
        const imageUrl = await upload(file);
        setCoverPreview(imageUrl);
        setCoverArt(imageUrl);
      } else if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.log("handleFileSelect:", error)
    }
    finally {
      setIsImgUploading(false)
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    try {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.type.startsWith('image/')) {
        const imageUrl = await upload(file);
        setCoverPreview(imageUrl);
        setCoverArt(imageUrl);
      } else if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.log("handleDrop:", error);
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Upload Song</h1>

      <form className="space-y-6">
        {/* Type toggle */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setIsAlbum(false)}
            className={`px-4 py-2 rounded ${!isAlbum ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setIsAlbum(true)}
            className={`px-4 py-2 rounded ${isAlbum ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            Album
          </button>
        </div>

        {/* Drag and Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={preventDefaults}
          className="w-full border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer"
        >
          <p className="mb-2">Drag & drop your cover or song here</p>
          <p className="text-sm text-gray-400">or click to select manually</p>
          <input type="file" accept="image/*,audio/*" onChange={handleFileSelect} className="hidden" id="fileInput" />
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

        {audioPreview && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Audio Preview:</label>
            <audio controls src={audioPreview} className="w-full" />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
