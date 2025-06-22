/**
 * Upload page component
 * Handles file upload and image processing
 */

import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import useImageProcessing from '../hooks/useImageProcessing';

const UploadPage: React.FC = () => {
  const {
    isLoading,
    error,
    products,
    previewUrl,
    handleFileSelect,
    processImage,
    reset
  } = useImageProcessing();

  const handleUpload = async () => {
    await processImage();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Product Image Analyzer
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
        
        {!previewUrl ? (
          <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
        ) : (
          <div className="space-y-4">
            <ImagePreview imageUrl={previewUrl} onRemove={reset} />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className={`px-4 py-2 rounded text-white transition-colors ${
                  isLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Analyze Image'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {products.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Detected Products</h2>
          <p className="text-gray-600 mb-4">
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-600">
                  {product.brand} • {product.category}
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    {product.iconCategory}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {Math.round(product.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;