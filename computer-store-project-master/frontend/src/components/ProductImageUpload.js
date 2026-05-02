/**
 * ProductImageUpload Component
 * Reusable component for uploading and managing product images with Base64 storage
 */

import React, { useState, useCallback } from 'react';
import {
  uploadImageForPreview,
  validateImageFile,
  compressImage,
  displayBase64Image
} from '../utils/imageUploadHelper';

export const ProductImageUpload = ({
  productId = null,
  onImageChange = () => {},
  currentImage = null,
  token = '',
  disabled = false,
  maxSize = 5 * 1024 * 1024,
  quality = 80
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Validate file
    const validation = validateImageFile(file, {
      maxSize,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (!validation.valid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      setUploading(true);

      // Show local preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Set file info
      setFileInfo({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type
      });

      // Upload to server
      const base64Data = await uploadImageForPreview(file, token);
      
      // Call callback with base64 data
      onImageChange({
        base64: base64Data,
        file,
        success: true
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Upload failed');
      onImageChange({
        success: false,
        error: err.message
      });
    } finally {
      setUploading(false);
    }
  }, [token, maxSize, onImageChange]);

  const handleRemoveImage = () => {
    setPreview(null);
    setFileInfo(null);
    setError(null);
    setSuccess(false);
    onImageChange({
      base64: null,
      success: true,
      removed: true
    });
  };

  const validatedImage = displayBase64Image(preview);

  return (
    <div className="product-image-upload">
      <div className="upload-area">
        <label htmlFor="image-input" className={`upload-label ${uploading ? 'uploading' : ''}`}>
          <input
            id="image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={uploading || disabled}
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <div className="upload-icon">📷</div>
            <p className="upload-text">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="upload-hint">JPG, PNG, or WebP • Max 5MB</p>
          </div>
        </label>
      </div>

      {validatedImage && (
        <div className="preview-section">
          <div className="preview-container">
            <img
              src={validatedImage}
              alt="Product preview"
              className="preview-image"
            />
          </div>

          {fileInfo && (
            <div className="file-info">
              <p><strong>Filename:</strong> {fileInfo.name}</p>
              <p><strong>Size:</strong> {fileInfo.size}</p>
              <p><strong>Type:</strong> {fileInfo.type}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={uploading || disabled}
            className="btn-remove"
          >
            ✕ Remove Image
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          ✓ Image uploaded successfully
        </div>
      )}

      <style jsx>{`
        .product-image-upload {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background-color: #f9f9f9;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #0070f3;
          background-color: #f0f7ff;
        }

        .upload-label {
          cursor: pointer;
          display: block;
        }

        .upload-label.uploading {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .upload-icon {
          font-size: 32px;
        }

        .upload-text {
          font-weight: 500;
          color: #333;
          margin: 0;
        }

        .upload-hint {
          font-size: 12px;
          color: #999;
          margin: 0;
        }

        .preview-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background-color: #f0f0f0;
          border-radius: 8px;
        }

        .preview-container {
          max-width: 300px;
          margin: 0 auto;
        }

        .preview-image {
          width: 100%;
          height: auto;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .file-info {
          font-size: 12px;
          color: #666;
          padding: 8px;
          background-color: #fff;
          border-radius: 4px;
        }

        .file-info p {
          margin: 4px 0;
        }

        .btn-remove {
          padding: 8px 16px;
          background-color: #ff4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-remove:hover:not(:disabled) {
          background-color: #cc0000;
        }

        .btn-remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 14px;
          margin: 0;
        }

        .alert-error {
          background-color: #ffe6e6;
          color: #cc0000;
          border-left: 4px solid #cc0000;
        }

        .alert-success {
          background-color: #e6ffe6;
          color: #009900;
          border-left: 4px solid #009900;
        }
      `}</style>
    </div>
  );
};

export default ProductImageUpload;

/**
 * Usage Example in Product Form
 * 
 * import ProductImageUpload from './ProductImageUpload';
 * 
 * function ProductForm() {
 *   const [formData, setFormData] = useState({
 *     name: '',
 *     price: '',
 *     image_base64: null
 *   });
 * 
 *   const handleImageChange = ({ base64, success, error }) => {
 *     if (success) {
 *       setFormData(prev => ({
 *         ...prev,
 *         image_base64: base64
 *       }));
 *     } else if (error) {
 *       console.error('Image error:', error);
 *     }
 *   };
 * 
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     
 *     const response = await fetch('/api/products', {
 *       method: 'POST',
 *       headers: {
 *         'Authorization': `Bearer ${token}`,
 *         'Content-Type': 'application/json'
 *       },
 *       body: JSON.stringify(formData)
 *     });
 *     
 *     // Handle response
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         type="text"
 *         placeholder="Product name"
 *         value={formData.name}
 *         onChange={(e) => setFormData({...formData, name: e.target.value})}
 *       />
 *       
 *       <ProductImageUpload
 *         onImageChange={handleImageChange}
 *         token={authToken}
 *       />
 *       
 *       <button type="submit">Create Product</button>
 *     </form>
 *   );
 * }
 */
