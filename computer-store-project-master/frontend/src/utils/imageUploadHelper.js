/**
 * Image Upload Helper with Base64 Support
 * Utility functions for handling Base64 image uploads and display
 */

/**
 * Convert File to Base64
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 data URI
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image and save to product
 * @param {File} file - Image file
 * @param {number} productId - Product ID to save to
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Upload response
 */
export const uploadImageToProduct = async (file, productId, token) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('productId', productId);

  const response = await fetch('/api/products/upload-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Upload image for preview (without saving to product)
 * @param {File} file - Image file
 * @param {string} token - Auth token
 * @returns {Promise<string>} Base64 data URI
 */
export const uploadImageForPreview = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/products/upload-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.imageBase64;
};

/**
 * Create product with Base64 image
 * @param {Object} productData - Product data
 * @param {File} imageFile - Image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Created product
 */
export const createProductWithImage = async (productData, imageFile, token) => {
  let image_base64 = null;

  if (imageFile) {
    const uploadResponse = await uploadImageForPreview(imageFile, token);
    image_base64 = uploadResponse;
  }

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...productData,
      image_base64
    })
  });

  if (!response.ok) {
    throw new Error(`Create product failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Update product with Base64 image
 * @param {number} productId - Product ID
 * @param {Object} updateData - Update data
 * @param {File} imageFile - Image file (optional)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Updated product
 */
export const updateProductWithImage = async (productId, updateData, imageFile, token) => {
  let image_base64 = null;

  if (imageFile) {
    const uploadResponse = await uploadImageForPreview(imageFile, token);
    image_base64 = uploadResponse;
  }

  const response = await fetch(`/api/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...updateData,
      ...(image_base64 && { image_base64 })
    })
  });

  if (!response.ok) {
    throw new Error(`Update product failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Validate image file
 * @param {File} file - Image file
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  } = options;

  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Compress image before upload (optional)
 * Note: Requires a canvas-based compression library
 * @param {File} file - Image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed file
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.8
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Display image from Base64
 * @param {string} base64Data - Base64 data URI
 * @returns {string} Validated data URI
 */
export const displayBase64Image = (base64Data) => {
  if (!base64Data) return null;
  
  // Ensure it's a valid data URI
  if (base64Data.startsWith('data:')) {
    return base64Data;
  }
  
  // Assume it's JPEG if no prefix
  return `data:image/jpeg;base64,${base64Data}`;
};

/**
 * React Component Example
 * 
 * import { uploadImageToProduct, validateImageFile } from './imageUtils';
 * 
 * function ProductForm({ productId, token }) {
 *   const [preview, setPreview] = useState(null);
 *   const [uploading, setUploading] = useState(false);
 * 
 *   const handleImageChange = async (e) => {
 *     const file = e.target.files[0];
 *     if (!file) return;
 * 
 *     // Validate
 *     const validation = validateImageFile(file);
 *     if (!validation.valid) {
 *       alert(validation.errors.join('\n'));
 *       return;
 *     }
 * 
 *     // Show preview
 *     const reader = new FileReader();
 *     reader.onload = (e) => setPreview(e.target.result);
 *     reader.readAsDataURL(file);
 * 
 *     // Upload
 *     try {
 *       setUploading(true);
 *       const response = await uploadImageToProduct(file, productId, token);
 *       console.log('Image saved:', response);
 *     } catch (error) {
 *       alert('Upload failed: ' + error.message);
 *     } finally {
 *       setUploading(false);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <input 
 *         type="file" 
 *         accept="image/*"
 *         onChange={handleImageChange}
 *         disabled={uploading}
 *       />
 *       {preview && <img src={preview} alt="Preview" style={{maxWidth: '200px'}} />}
 *     </div>
 *   );
 * }
 */
