import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import ReferrerPage from './pages/ReferrerPage';
import ExtensionRedirect from './pages/ExtensionRedirect';
import { useImageProcessing } from './features/image-upload';
import { trackWebsiteVisit } from './lib/api/client';

const App = () => {
    const {
        isLoading,
        error,
        products,
        previewUrl,
        analysisCompleted,
        handleFileSelect,
        processImage,
        reset
    } = useImageProcessing();
    
    // Track website visit on mount
    useEffect(() => {
        trackWebsiteVisit();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Router>
                    <Routes>
                        <Route 
                            path="/"
                            element={
                                <UploadPage
                                    isLoading={isLoading}
                                    error={error}
                                    previewUrl={previewUrl}
                                    analysisCompleted={analysisCompleted}
                                    handleFileSelect={handleFileSelect}
                                    processImage={processImage}
                                    reset={reset}
                                />
                            }
                        />
                        <Route
                            path="/results"
                            element={
                                <ResultsPage
                                    imageUrl={previewUrl}
                                    products={products}
                                    onReset={reset}
                                />
                            } 
                        />
                        <Route
                            path="/referrer"
                            element={
                                <ReferrerPage />
                            }
                        />
                        <Route
                            path="/extension"
                            element={
                                <ExtensionRedirect />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
        </div>
    );
};

export default App;
