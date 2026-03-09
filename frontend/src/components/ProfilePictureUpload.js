import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';

const ProfilePictureUpload = ({ onUploadSuccess, currentImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      setSuccess(false);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setSuccess(false);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/upload/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        setSuccess(false);
        setPreview(currentImageUrl || null);
      } else {
        setSuccess(true);
        setError(null);
        setPreview(`http://localhost:4000${data.fileUrl}`);
        if (onUploadSuccess) {
          onUploadSuccess(data.fileUrl);
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setSuccess(false);
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
        {/* Preview */}
        {preview && (
          <div className="mb-6 relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
            />
            {success && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Check className="text-green-400" size={40} />
              </div>
            )}
          </div>
        )}

        {/* Upload Area */}
        {!uploading && !preview && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors cursor-pointer hover:border-indigo-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold mb-1">Drag & drop your image here</p>
            <p className="text-slate-500 text-sm">or click to browse (JPEG, PNG, WebP, max 10MB)</p>
          </div>
        )}

        {/* Loading State */}
        {uploading && (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <p className="text-slate-600 font-semibold">Uploading...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <X size={18} /> {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm flex items-center gap-2">
              <Check size={18} /> Profile picture uploaded successfully!
            </p>
          </div>
        )}

        {/* Upload Button (for preview state) */}
        {preview && !uploading && (
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Change Photo
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setError(null);
                setSuccess(false);
              }}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all"
            >
              Remove
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
