'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useCheckAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { ArrowLeft, Trash2, Upload, Crop, X } from 'lucide-react';

const PRODUCT_IMAGE_WIDTH = 500;
const PRODUCT_IMAGE_HEIGHT = 500;

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = params.id as string;
  const { user, isLoading: isAuthLoading } = useCheckAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    active: true,
    image: null as File | null,
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Image cropping states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  // Fetch product
  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/products/${productId}`);
      return response.data;
    },
    enabled: !!productId && !!user && user.role === 'ADMIN',
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('products/categories');
        console.log('Categories API Response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Categories fetch error:', error.message || error);
        throw error;
      }
    },
  });

  // Get categories array - handle different response formats
  const categories = React.useMemo(() => {
    console.log('Processing categories:', categoriesData);
    if (Array.isArray(categoriesData)) {
      return categoriesData;
    }
    if (Array.isArray(categoriesData?.data)) {
      return categoriesData.data;
    }
    if (Array.isArray(categoriesData?.categories)) {
      return categoriesData.categories;
    }
    return [];
  }, [categoriesData]);

  // Update form when product data loads
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        categoryId: product.categoryId || '',
        active: product.active !== false,
        image: null,
      });
      if (product.image) {
        setCurrentImageUrl(product.image);
      }
    }
  }, [productData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ image: 'Please select an image file' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = () => {
    if (!imageRef.current || !canvasRef.current || !uploadedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imageRef.current;

    // Set canvas size to product image dimensions
    canvas.width = PRODUCT_IMAGE_WIDTH;
    canvas.height = PRODUCT_IMAGE_HEIGHT;

    // The container is the visible crop area (approximately 300x300 or similar)
    // The image is transformed with: translate(cropPosition.x, cropPosition.y) scale(cropZoom)
    // We need to extract what's visible in the container from the original image
    
    // Calculate the source rectangle from the original image
    // The visible area in image coordinates is:
    const sourceX = Math.max(0, -cropPosition.x / cropZoom);
    const sourceY = Math.max(0, -cropPosition.y / cropZoom);
    
    // The container shows a square area, we need to match that aspect
    const containerSize = 300; // Approximate visible crop area
    const sourceWidth = containerSize / cropZoom;
    const sourceHeight = containerSize / cropZoom;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      PRODUCT_IMAGE_WIDTH,
      PRODUCT_IMAGE_HEIGHT
    );

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'product-image.jpg', { type: 'image/jpeg' });
        setFormData((prev) => ({ ...prev, image: file }));
        setCurrentImageUrl(URL.createObjectURL(file));
        setShowCropModal(false);
        setUploadedImage(null);
      }
    }, 'image/jpeg', 0.9);
  };

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async () => {
      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock, 10);

      if (isNaN(price) || isNaN(stock)) {
        throw new Error('Price and stock must be valid numbers');
      }

      const payload: any = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price,
        stock,
        categoryId: formData.categoryId,
        active: formData.active,
      };

      // If image is available, convert it to base64 and include in payload
      if (formData.image) {
        const reader = new FileReader();
        const imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.image!);
        });
        payload.images = [imageBase64];
      }

      const response = await apiClient.put(`/admin/products/${productId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', productId] });
      router.push('/admin/products');
    },
    onError: (error: any) => {
      setErrors(error.response?.data?.errors || { submit: 'Failed to update product' });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/admin/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      router.push('/admin/products');
    },
    onError: (error: any) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to delete product' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateProductMutation.mutate();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProductMutation.mutate();
    }
  };

  if (isAuthLoading || isProductLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN' || !productData?.data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Product Image (500x500px)
              </label>
              <div className="space-y-4">
                {currentImageUrl && (
                  <div className="relative w-full">
                    <img
                      src={currentImageUrl}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      >
                        <Upload size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentImageUrl(null);
                          setFormData((prev) => ({ ...prev, image: null }));
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
                {!currentImageUrl && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
                  >
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.sku ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter SKU"
                />
                {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isCategoriesLoading}
                >
                  <option value="">
                    {isCategoriesLoading 
                      ? 'Loading categories...' 
                      : categoriesError 
                      ? 'Error loading categories' 
                      : 'Select a category'}
                  </option>
                  {categories.length > 0 ? (
                    categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    !isCategoriesLoading && <option disabled>No categories available</option>
                  )}
                </select>
                {categoriesError && (
                  <p className="mt-1 text-sm text-red-600">
                    Failed to load categories. Please try refreshing the page.
                  </p>
                )}
                {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Active Product
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={updateProductMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
              >
                {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg text-center"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteProductMutation.isPending}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && uploadedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crop Product Image</h2>
              <button
                onClick={() => setShowCropModal(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Crop Preview */}
            <div className="mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <div className="relative w-full max-w-md h-96 bg-gray-50 dark:bg-gray-600 rounded overflow-hidden border-2 border-dashed border-gray-400 mb-4">
                <img
                  ref={imageRef}
                  src={uploadedImage}
                  alt="Crop preview"
                  style={{
                    transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom})`,
                    transformOrigin: '0 0',
                    cursor: 'grab',
                  }}
                  className="absolute top-0 left-0 h-full"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDrag={(e) => {
                    if (e.clientX || e.clientY) {
                      setCropPosition((prev) => ({
                        x: prev.x + (e.clientX || 0),
                        y: prev.y + (e.clientY || 0),
                      }));
                    }
                  }}
                />
                {/* Target frame */}
                <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
              </div>

              {/* Zoom Control */}
              <div className="w-full max-w-md">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Zoom: {(cropZoom * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Hidden Canvas for Processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCropConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Crop size={18} />
                Crop & Use
              </button>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
