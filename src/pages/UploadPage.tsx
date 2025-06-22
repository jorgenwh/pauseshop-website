/**
 * Upload page component
 * Handles file upload and image processing
 */

import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import useImageProcessing from '../hooks/useImageProcessing';
import { constructAmazonSearchUrl } from '../lib/utils';

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
      <h1 className="text-4xl font-bold mb-2 text-center">
        <span className="text-white">Pause</span>
        <span className="text-[#30B3A4]">Shop</span>
      </h1>
      <p className="text-center text-gray-400 mb-8 max-w-lg mx-auto">
        Pause your favorite videos, upload a screenshot, and let AI find the products on Amazon for you!
      </p>
      
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Upload an Image</h2>
        
        {!previewUrl ? (
          <>
            <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
            <div className="mt-4 text-sm text-gray-400 bg-gray-700 p-4 rounded-lg border border-gray-600">
              <p className="font-medium text-gray-200 mb-2">📸 Tips for best results:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Take clear screenshots from videos</li>
                <li>Pause when products are clearly visible</li>
                <li>Include the whole item in the frame</li>
                <li>PNG or JPG formats only</li>
              </ul>
            </div>
            
            <div className="mt-4 bg-gradient-to-r from-gray-800 to-[#30B3A4]/20 p-5 rounded-lg border border-[#30B3A4]/30">
              <p className="font-medium text-white mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#30B3A4]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                How to take screenshots:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-3 rounded-md">
                  <p className="font-medium text-[#30B3A4] mb-2">Windows:</p>
                  <ul className="space-y-1 text-gray-300">
                    <li><span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1">PrtScn</span> Capture entire screen</li>
                    <li><span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1">Alt+PrtScn</span> Capture active window</li>
                    <li><span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1">Win+Shift+S</span> Snipping tool</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-md">
                  <p className="font-medium text-[#30B3A4] mb-2">Mac:</p>
                  <ul className="space-y-1 text-gray-300">
                    <li><span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1">⌘+Shift+3</span> Capture entire screen</li>
                    <li><span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1">⌘+Shift+4</span> Capture selected area</li>
                    <li><span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs mr-1">⌘+Shift+5</span> Screenshot options</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <ImagePreview imageUrl={previewUrl} onRemove={reset} />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors flex items-center"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className={`px-4 py-2 rounded-md text-white transition-colors flex items-center ${
                  isLoading 
                    ? 'bg-[#30B3A4]/70 cursor-not-allowed' 
                    : 'bg-[#30B3A4] hover:bg-[#30B3A4]/80'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Analyze Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {products.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Detected Products</h2>
            <span className="bg-[#30B3A4]/10 text-[#30B3A4] text-xs font-semibold px-3 py-1 rounded-full">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg text-white">{product.name}</h3>
                    <p className="text-gray-300">
                      {product.brand || 'Unknown brand'} • {product.category}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {Math.round(product.confidence * 100)}%
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.features && product.features.length > 0 && product.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {product.primaryColor && (
                    <span className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded flex items-center">
                      <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: product.primaryColor }}></div>
                      {product.primaryColor}
                    </span>
                  )}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <a 
                    href={constructAmazonSearchUrl(product)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#30B3A4] hover:text-[#30B3A4]/80 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Find on Amazon
                  </a>
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