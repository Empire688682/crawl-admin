"use client"
import { useState, useRef } from 'react';

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setCoverArt(file);
      setCoverPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setCoverArt(file);
      setCoverPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
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

        {/* Preview */}
        {coverPreview && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Cover Art Preview:</label>
            <img src={coverPreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
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
