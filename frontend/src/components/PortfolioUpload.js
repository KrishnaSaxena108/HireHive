import React, { useState, useRef } from 'react';
import { FileUp, X, Check, Download } from 'lucide-react';

const PortfolioUpload = ({ onUploadSuccess, currentFileUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileUrl, setFileUrl] = useState(currentFileUrl || null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document (PDF, DOC, DOCX)');
      setSuccess(false);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setSuccess(false);
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/upload/portfolio', {
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
      } else {
        setSuccess(true);
        setError(null);
        setFileUrl(`http://localhost:4000${data.fileUrl}`);
        if (onUploadSuccess) {
          onUploadSuccess(data.fileUrl);
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setSuccess(false);
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
    e.currentTarget.classList.add('border-teal-500', 'bg-teal-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-teal-500', 'bg-teal-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-teal-500', 'bg-teal-50');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="ui-glass rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
        {/* Current File Display */}
        {fileUrl && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="text-teal-600" size={28} />
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{fileName || 'Portfolio'}</p>
                  <p className="text-sm text-slate-500">Uploaded successfully</p>
                </div>
              </div>
              {success && <Check className="text-green-500" size={24} />}
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!uploading && !fileUrl && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 transition-colors cursor-pointer hover:border-teal-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold mb-1">Drag & drop your portfolio here</p>
            <p className="text-slate-500 text-sm">or click to browse (PDF, DOC, DOCX, max 10MB)</p>
          </div>
        )}

        {/* Loading State */}
        {uploading && (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-3"></div>
            <p className="text-slate-600 font-semibold">Uploading {fileName}...</p>
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
              <Check size={18} /> Portfolio uploaded successfully!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {fileUrl && !uploading && (
          <div className="mt-6 flex gap-3 justify-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Download size={18} /> View/Download
            </a>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
            >
              Replace
            </button>
            <button
              onClick={() => {
                setFileUrl(null);
                setFileName('');
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
          accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PortfolioUpload;
