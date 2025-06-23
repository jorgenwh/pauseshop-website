/**
 * Upload page component
 * Handles file upload and image processing
 */

// Import from features
import { FileUpload, ImagePreview, TipsSection, useImageProcessing } from '../features/image-upload';
import { ProductList } from '../features/product-display';

// Import from shared components
import { ErrorMessage } from '../components/feedback';
import { ActionButtons } from '../components/ui';

// Import constants
import { TEXT } from '../lib/constants';

const UploadPage = () => {
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
                {TEXT.appDescription}
            </p>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">{TEXT.uploadTitle}</h2>

                {!previewUrl ? (
                    <>
                        <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
                        <TipsSection />
                    </>
                ) : (
                    <div className="space-y-4">
                        <ImagePreview imageUrl={previewUrl} onRemove={reset} />

                        <ActionButtons
                            onCancel={reset}
                            onAnalyze={handleUpload}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>

            <ErrorMessage message={error} />

            <ProductList products={products} />
        </div>
    );
};

export default UploadPage;
