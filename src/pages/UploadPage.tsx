/**
 * Upload page component
 * Handles file upload and image processing
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import from features
import { FileUpload, ImagePreview, TipsSection } from '../features/image-upload';

// Import from shared components
import { ErrorMessage } from '../components/feedback';
import { ActionButtons, AppHeader, Card } from '../components/ui';

// Import constants
import { TEXT } from '../lib/constants';

interface UploadPageProps {
    isLoading: boolean;
    error: string | null;
    previewUrl: string | null;
    analysisCompleted: boolean;
    handleFileSelect: (file: File) => string;
    processImage: () => Promise<void>;
    reset: () => void;
}

const UploadPage = ({
    isLoading,
    error,
    previewUrl,
    analysisCompleted,
    handleFileSelect,
    processImage,
    reset
}: UploadPageProps) => {
    const navigate = useNavigate();

    // Navigate to results page when analysis is completed (regardless of whether products were found)
    useEffect(() => {
        if (analysisCompleted && !isLoading) {
            navigate('/results');
        }
    }, [analysisCompleted, isLoading, navigate]);

    const handleUpload = async () => {
        await processImage();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <AppHeader subtitle={TEXT.appDescription} className="mb-8" />

            <Card className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">{TEXT.uploadTitle}</h2>

                {!previewUrl ? (
                    <>
                        <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
                        <TipsSection />
                    </>
                ) : (
                    <div className="space-y-4">
                        <ImagePreview imageUrl={previewUrl} />

                        <ActionButtons
                            onCancel={reset}
                            onAnalyze={handleUpload}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </Card>

            <ErrorMessage message={error} />
        </div>
    );
};

export default UploadPage;
