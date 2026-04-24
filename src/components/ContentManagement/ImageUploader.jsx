'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const ImageUploader = ({ onUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  useEffect(() => {
    const handlePasteEvent = (e) => {
      // Only handle paste if the click or focus is within this uploader
      const target = e.target;
      const uploaderElement = dropZoneRef.current;
      
      if (!uploaderElement || !uploaderElement.contains(target)) {
        return; // Don't handle paste for other uploaders
      }
      
      handlePaste(e);
    };

    // Add paste event listener to the document
    document.addEventListener('paste', handlePasteEvent);

    // Cleanup
    return () => {
      document.removeEventListener('paste', handlePasteEvent);
    };
  }, []);

  const handleRemoveImage = () => {
    setPreview('');
    onUpload('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (!files) return;

    // Handle the first image file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        await uploadImage(file);
        break;
      }
    }
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await uploadImage(file);
          break;
        }
      }
    }
  };

  const uploadImage = async (file) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      console.log('ImageUploader - Uploading file:', file.name, 'Size:', file.size);
      
      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData
      });

      console.log('ImageUploader - Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('ImageUploader - Upload failed:', errorData);
        throw new Error(errorData?.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('ImageUploader - Upload success:', data);
      onUpload(data.url);
    } catch (err) {
      setError(err?.message || 'Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    await uploadImage(file);
  };

  return (
    <div ref={dropZoneRef}>
      {error && <Alert variant="danger" className="mb-2">{error}</Alert>}

      <div className="mb-2">
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ 
                width: '100%', 
                height: '150px', 
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}
            />
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                padding: '4px 8px',
                fontSize: '12px'
              }}
            >
              Remove
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <i className="bi bi-cloud-upload" style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.5 }}></i>
            <div style={{ fontWeight: '500' }}>Click, paste, or drop image here</div>
            <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>Recommended: 800x600px • Max: 5MB</div>
            <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.6, fontStyle: 'italic' }}>Drag & drop • Paste (Ctrl+V) • Click to browse</div>
          </div>
        )}
        {uploading && (
          <div className="mt-2 text-center">
            <Spinner animation="border" role="status" size="sm" className="me-2" />
            <span style={{ fontSize: '13px' }}>Uploading...</span>
          </div>
        )}
      </div>

      <Form.Control
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: 'none' }}
      />

      <div className="d-grid gap-2 mb-2">
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <i className="bi bi-upload me-1"></i>
          Choose File
        </Button>
      </div>

      <Form.Group>
        <Form.Control
          type="text"
          size="sm"
          placeholder="or paste image URL"
          defaultValue={currentImage}
          onChange={(e) => onUpload(e.target.value)}
          style={{ fontSize: '13px' }}
        />
      </Form.Group>
    </div>
  );
};

export default ImageUploader;
