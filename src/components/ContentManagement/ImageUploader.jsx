'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const ImageUploader = ({ onUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleRemoveImage = () => {
    setPreview('');
    onUpload('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  return (
    <div>
      {error && <Alert variant="danger" className="mb-2">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Form.Text className="text-muted">
          Max file size: 5MB (JPG, PNG, GIF, WebP)
        </Form.Text>
      </Form.Group>

      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
          />
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
              Delete Image
            </Button>
          </div>
          {uploading && (
            <div className="mt-2">
              <Spinner animation="border" role="status" size="sm" className="me-2" />
              Uploading...
            </div>
          )}
        </div>
      )}

      <Form.Group className="mb-3">
        <Form.Label>or enter image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="/uploads/image.jpg or https://example.com/image.jpg"
          defaultValue={currentImage}
          onChange={(e) => onUpload(e.target.value)}
        />
      </Form.Group>
    </div>
  );
};

export default ImageUploader;
