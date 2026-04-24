'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const VideoUploader = ({ onUpload, currentVideo }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentVideo);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentVideo || '');
  }, [currentVideo]);

  const handleRemoveVideo = () => {
    setPreview('');
    onUpload('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - allow video files
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    if (!validVideoTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, WebM, OGG, MOV, AVI)');
      return;
    }

    // Validate file size (max 50MB for videos)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create preview (for videos, we'll show the file name)
      setPreview(file.name);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      console.log('VideoUploader - Uploading file:', file.name, 'Size:', file.size);
      
      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData
      });

      console.log('VideoUploader - Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('VideoUploader - Upload failed:', errorData);
        throw new Error(errorData?.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('VideoUploader - Upload success:', data);
      onUpload(data.url);
    } catch (err) {
      setError(err?.message || 'Failed to upload video');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {error && <Alert variant="danger" className="mb-2">{error}</Alert>}

      <div className="mb-2">
        {preview ? (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '150px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '20px'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎥</div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d', textAlign: 'center' }}>
                {typeof preview === 'string' && preview.startsWith('http') ? 
                  'Video uploaded' : 
                  preview
                }
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemoveVideo}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                padding: '0'
              }}
            >
              ×
            </Button>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.borderColor = '#adb5bd';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#dee2e6';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎥</div>
            <div style={{ fontSize: '0.9rem', color: '#6c757d', textAlign: 'center' }}>
              Click to upload video
            </div>
            <div style={{ fontSize: '0.8rem', color: '#adb5bd', marginTop: '5px' }}>
              MP4, WebM, OGG, MOV, AVI (max 50MB)
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {uploading && (
        <div className="text-center">
          <Spinner animation="border" size="sm" className="me-2" />
          Uploading video...
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
